'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { checkAndClaimInvitation } from '../lib/service';
import type { Profile, StaffAssignment, UserRole } from '../types';

/**
 * useRestagAuth Hook
 * Enforces secure authorization policies on Client Component Layouts and Pages.
 * Automatically handles:
 * - Session validations and reactive redirects to /restag/login
 * - Role-based route segregation for admins (/restag/admin) and team members (/restag/merchant)
 * - Fetching Staff permissions and enforcing plans' module-level locks
 */
export function useRestagAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffAssignment, setStaffAssignment] = useState<StaffAssignment | null>(null);
  const [restaurantSubscription, setRestaurantSubscription] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user) {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
          // Dynamic redirect only for secure layout routes
          if (pathname.startsWith('/restag/merchant') || pathname.startsWith('/restag/admin')) {
            router.push('/restag/login');
          }
          return;
        }

        // Fetch user metadata profile
        let { data: userProfile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileErr || !userProfile) {
          throw new Error('Profile database entry not found');
        }

        // Dynamically claim any pending invitations for the customer
        if (userProfile.role === 'customer' && session.user.email) {
          try {
            const claimed = await checkAndClaimInvitation(session.user.email, session.user.id);
            if (claimed) {
              // Re-fetch profile to acquire the promoted role in real-time
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              if (updatedProfile) {
                userProfile = updatedProfile;
              }
            }
          } catch (e) {
            console.error('[RESTAG_AUTH] Invitation auto-claiming error:', e);
          }
        }

        if (!mounted) return;
        setProfile(userProfile);


        // A. Guard check for Superadministrators
        if (pathname.startsWith('/restag/admin') && userProfile.role !== 'ag47_admin') {
          router.push('/restag/unauthorized');
          return;
        }

        // B. Guard check for Merchant & Staff panels
        if (pathname.startsWith('/restag/merchant')) {
          if (userProfile.role !== 'merchant' && userProfile.role !== 'staff') {
            router.push('/restag/unauthorized');
            return;
          }

          // C. Staff sub-routing checks and allowed modules fetching
          if (userProfile.role === 'staff') {
            const { data: assignment, error: assignErr } = await supabase
              .from('restag_staff_assignments')
              .select('*, restag_restaurants(subscription)')
              .eq('profile_id', session.user.id)
              .single();

            if ((assignErr || !assignment) && mounted) {
              router.push('/restag/unauthorized');
              return;
            }

            if (mounted && assignment) {
              setStaffAssignment(assignment as any);
              setRestaurantSubscription((assignment as any).restag_restaurants?.subscription || null);
              
              // Validate specific paths in real-time
              const activeModules = (assignment.restag_restaurants as any)?.subscription?.active_modules || [];
              const allowedModules = assignment.allowed_modules || [];
              
              const isReservasRoute = pathname.includes('/merchant/reservas');
              const isMenuRoute = pathname.includes('/merchant/menu');

              if (isReservasRoute && (!activeModules.includes('RESERVATIONS') || !allowedModules.includes('RESERVATIONS'))) {
                router.push('/restag/merchant?error=reservas_bloqueado');
              }
              if (isMenuRoute && (!activeModules.includes('MENU') || !allowedModules.includes('MENU'))) {
                router.push('/restag/merchant?error=menu_bloqueado');
              }
            }
          }
        }
      } catch (err) {
        console.error('[RESTAG_AUTH] Verification exception:', err);
        if (mounted) {
          setProfile(null);
        }
        if (pathname.startsWith('/restag/merchant') || pathname.startsWith('/restag/admin')) {
          router.push('/restag/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    // Listen live to state terminations
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (mounted) {
          setProfile(null);
          setStaffAssignment(null);
          setRestaurantSubscription(null);
        }
        if (pathname.startsWith('/restag/merchant') || pathname.startsWith('/restag/admin')) {
          router.push('/restag/login');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  /**
   * hasModule - Evaluates permission dynamically.
   * - Admins get universal bypass.
   * - Merchants bypass if they have active modules.
   * - Staff must have module assigned AND the merchant must have the module active in their plan.
   */
  const hasModule = (moduleName: 'MENU' | 'RESERVATIONS' | 'ADS' | 'WHATSAPP'): boolean => {
    if (!profile) return false;
    if (profile.role === 'ag47_admin') return true;

    if (profile.role === 'merchant') {
      return true; // Merchants typically managed by overall billing layout, full access on dashboard
    }

    if (profile.role === 'staff') {
      if (!staffAssignment || !restaurantSubscription) return false;
      const isPlanActive = restaurantSubscription.active_modules?.includes(moduleName);
      const isAssigned = staffAssignment.allowed_modules?.includes(moduleName);
      return !!(isPlanActive && isAssigned);
    }

    return false;
  };

  return {
    profile,
    role: profile?.role || null,
    loading,
    staffAssignment,
    restaurantSubscription,
    hasModule,
    isAuthenticated: !!profile,
  };
}
