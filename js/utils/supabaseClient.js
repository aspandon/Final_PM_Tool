// js/utils/supabaseClient.js
// Supabase client configuration for browser-based JavaScript

const SUPABASE_URL = 'https://erumehpzdescjyfliceb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydW1laHB6ZGVzY2p5ZmxpY2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzY2NTIsImV4cCI6MjA3ODUxMjY1Mn0.auEWMASHrTXMKCof__Ti_JKqAqGEpFxs7v42wGkwznw';

// Initialize Supabase client
// Note: supabase global object is loaded from CDN in HTML
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');
