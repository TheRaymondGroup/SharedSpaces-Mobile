import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

// Use process.env for environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if the variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Supabase URL or Key is undefined. "
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
