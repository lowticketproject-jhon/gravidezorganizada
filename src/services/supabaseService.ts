import { supabase } from '../lib/supabase';
import { UserData, Appointment, Checklist } from '../types';

export const supabaseService = {
  async saveUserData(userId: string, data: { userData: UserData | null, appointments: Appointment[], checklists: Checklist[] }) {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        data: data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
    }
  },

  async getUserData(userId: string) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching from Supabase:', error);
      }
      return null;
    }

    return data?.data;
  }
};
