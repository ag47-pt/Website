-- =====================================================================
-- MIGRATION: RESTAG Auth Hierarchy, Staff Management & Customer CRM
-- =====================================================================
-- This migration script sets up:
-- 1. Table public.restag_staff_assignments (linking staff users to restaurants with module gating & CRUD permissions)
-- 2. Table public.restag_invitations (for inviting staff via email tokens)
-- 3. Table public.restag_customers (CRM database automatically updated by reservations)
-- 4. PostgreSQL helper functions and policies (RLS) to enforce strict isolation.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. PROFILE ROLE CONSTRAINT EXTENSION
-- ---------------------------------------------------------------------
-- Note: If your profiles table has a CHECK constraint on role, 
-- drop it and recreate it to include 'staff'.
-- Example:
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
--   CHECK (role IN ('ag47_admin', 'merchant', 'staff', 'customer'));

-- ---------------------------------------------------------------------
-- 2. STAFF ASSIGNMENTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restag_staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restag_restaurants(id) ON DELETE CASCADE,
    allowed_modules VARCHAR[] NOT NULL DEFAULT '{}', -- ex: {'MENU', 'RESERVATIONS'}
    permissions JSONB NOT NULL DEFAULT '{"can_create": true, "can_read": true, "can_update": true, "can_delete": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_staff_assignment UNIQUE (profile_id, restaurant_id)
);

COMMENT ON COLUMN public.restag_staff_assignments.allowed_modules IS 'Array of active modules permitted for this staff: MENU, RESERVATIONS, ADS, WHATSAPP';

-- ---------------------------------------------------------------------
-- 3. STAFF INVITATIONS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restag_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restag_restaurants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    allowed_modules VARCHAR[] NOT NULL DEFAULT '{}',
    permissions JSONB NOT NULL DEFAULT '{"can_create": true, "can_read": true, "can_update": true, "can_delete": false}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT unique_pending_invitation UNIQUE (email, restaurant_id, status)
);

-- ---------------------------------------------------------------------
-- 4. CUSTOMER CRM TABLE (Frictionless Registry)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restag_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restag_restaurants(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_reservations INT NOT NULL DEFAULT 1,
    notes TEXT,
    tags VARCHAR[] DEFAULT '{}', -- ex: {'VIP', 'Frequent', 'Allergies'}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_customer_restaurant UNIQUE (profile_id, restaurant_id)
);

-- ---------------------------------------------------------------------
-- 5. FUNCTION & TRIGGER: AUTOMATIC RESERVATION CRM SYNCHRONIZATION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_reservation_to_crm()
RETURNS TRIGGER AS $$
DECLARE
    v_profile_id UUID;
    v_has_vip_threshold BOOLEAN := false;
    v_tags VARCHAR[];
BEGIN
    -- 1. Try to find the profile_id matching the customer's email
    SELECT p.id INTO v_profile_id
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE u.email = NEW.customer_email
    LIMIT 1;

    -- 2. Fallback to auth.uid() if user is currently logged in and making the reservation
    IF v_profile_id IS NULL THEN
        v_profile_id := auth.uid();
    END IF;

    -- 3. If a valid registered profile is found, perform the UPSERT into the CRM
    IF v_profile_id IS NOT NULL THEN
        INSERT INTO public.restag_customers (restaurant_id, profile_id, total_reservations, tags)
        VALUES (NEW.restaurant_id, v_profile_id, 1, ARRAY['Novo Cliente']::VARCHAR[])
        ON CONFLICT (profile_id, restaurant_id)
        DO UPDATE SET 
            total_reservations = public.restag_customers.total_reservations + 1,
            updated_at = timezone('utc'::text, now())
        RETURNING (total_reservations >= 5) INTO v_has_vip_threshold;

        -- Promote to VIP status if customer reaches 5+ reservations
        IF v_has_vip_threshold THEN
            UPDATE public.restag_customers
            SET tags = ARRAY_APPEND(ARRAY_REMOVE(tags, 'Novo Cliente'), 'VIP')
            WHERE profile_id = v_profile_id AND restaurant_id = NEW.restaurant_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the CRM trigger to reservations insert
DROP TRIGGER IF EXISTS trg_sync_reservation_to_crm ON public.restag_reservations;
CREATE TRIGGER trg_sync_reservation_to_crm
AFTER INSERT ON public.restag_reservations
FOR EACH ROW
EXECUTE FUNCTION public.sync_reservation_to_crm();

-- ---------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

-- Enable RLS on newly created tables
ALTER TABLE public.restag_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restag_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restag_customers ENABLE ROW LEVEL SECURITY;

-- A. STAFF ASSIGNMENTS POLICIES
CREATE POLICY "Admins have full control of staff assignments"
ON public.restag_staff_assignments FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'ag47_admin'));

CREATE POLICY "Merchants manage their restaurant staff assignments"
ON public.restag_staff_assignments FOR ALL
USING (
    restaurant_id IN (
        SELECT id FROM public.restag_restaurants WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "Staff can view their own assignments"
ON public.restag_staff_assignments FOR SELECT
USING (profile_id = auth.uid());

-- B. INVITATIONS POLICIES
CREATE POLICY "Merchants manage invitations"
ON public.restag_invitations FOR ALL
USING (
    restaurant_id IN (
        SELECT id FROM public.restag_restaurants WHERE owner_id = auth.uid()
    )
);

-- C. CUSTOMER CRM POLICIES
CREATE POLICY "Merchants view customer CRM of their restaurants"
ON public.restag_customers FOR SELECT
USING (
    restaurant_id IN (
        SELECT id FROM public.restag_restaurants WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "Staff view customer CRM if assigned"
ON public.restag_customers FOR SELECT
USING (
    restaurant_id IN (
        SELECT restaurant_id FROM public.restag_staff_assignments WHERE profile_id = auth.uid()
    )
);

COMMIT;
