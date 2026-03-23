import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://nmsuhccmzhbxdxzlcjfi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_t8FfBhCa64u4a4VLLLi4fQ_yXlR6a18';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
