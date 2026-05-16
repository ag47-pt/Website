import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Localized Supabase instance for the RESTAG portal.
 * This allows the portal to have its own connection configuration
 * if needed during the standalone migration.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
