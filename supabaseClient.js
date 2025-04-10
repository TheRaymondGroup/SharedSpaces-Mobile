import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Replace with your Supabase URL and anon key

// should put this in an .env file for security but this is a school project so I dont care.
const supabaseUrl = 'https://tgtavubtalweruhahmsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndGF2dWJ0YWx3ZXJ1aGFobXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY4NDEsImV4cCI6MjA1NjgxMjg0MX0.ElQIcUiIkSdkk9KDyjLoYLyqzstSbkuTLmhUIGsYrM8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);