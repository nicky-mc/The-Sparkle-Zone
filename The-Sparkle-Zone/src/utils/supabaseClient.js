// utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hasatlmjddrwgmaaosen.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc2F0bG1qZGRyd2dtYWFvc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNzMzNzYsImV4cCI6MjA0NDY0OTM3Nn0.VdbiBT7ArnJF7sVJn8QYbpdWXXbqdNUvIL2xrIfdsWc"; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
