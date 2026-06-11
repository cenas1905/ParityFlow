import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

// Tip tanimlari
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_type: string;
          created_at: string;
          updated_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          domain: string;
          is_active: boolean;
          created_at: string;
        };
      };
      project_settings: {
        Row: {
          id: string;
          project_id: string;
          banner_title: string;
          banner_text: string;
          banner_cta: string;
          banner_theme: string;
          banner_position: string;
          primary_color: string;
          tier2_discount: number;
          tier2_coupon: string;
          tier2_countries: string[];
          tier3_discount: number;
          tier3_coupon: string;
          tier3_countries: string[];
          tier4_discount: number;
          tier4_coupon: string;
          tier4_countries: string[];
          trigger_type: string;
          trigger_delay: number;
          ab_test_enabled: boolean;
        };
      };
      analytics: {
        Row: {
          id: number;
          project_id: string;
          country_code: string;
          event_type: string;
          variant: string;
          user_agent?: string | null;
          created_at: string;
        };
      };
    };
  };
};

// Server-side (API routes icin bypass RLS) Supabase client
export const createServerSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
  return createClient<Database>(url, key);
};

// Client-side (Browser'da) Supabase client
export const createBrowserSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
  return createBrowserClient<Database>(url, key);
};

// serverComponent client has been moved to supabaseServer.ts
