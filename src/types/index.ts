import { Database } from '@/lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectSettings = Database['public']['Tables']['project_settings']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics']['Row'];

export interface CountryTier {
  tier: number;
  label: string;
  countries: string;
  discountKey: keyof ProjectSettings;
  couponKey: keyof ProjectSettings;
}
