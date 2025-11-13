-- ============================================
-- Supabase Authentication Setup for PM Tool
-- ============================================
-- This script sets up authentication and creates the admin user
-- ============================================

-- IMPORTANT: You must run this in the Supabase SQL Editor
-- Go to: https://erumehpzdescjyfliceb.supabase.co
-- Click: SQL Editor → New Query
-- Paste this entire script and click Run

-- ============================================
-- Step 0: Enable Required Extensions
-- ============================================
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Step 1: Enable Email Authentication
-- ============================================
-- This is done through the Supabase Dashboard UI:
-- 1. Go to Authentication → Providers
-- 2. Enable "Email" provider
-- 3. Disable "Confirm email" (optional, for easier setup)

-- ============================================
-- Step 2: Create Admin User
-- ============================================
-- This creates the admin user with your specified credentials
-- Username: Admin (converted to email: admin@pmtool.local)
-- Password: 46344617

-- Insert the admin user into auth.users table
-- Note: This uses Supabase's auth.uid() function which generates a UUID
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    raw_app_meta_data,
    raw_user_meta_data
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@pmtool.local',
    crypt('46344617', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '{"provider":"email","providers":["email"]}',
    '{"username":"Admin"}'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@pmtool.local'
);

-- Also create identity for the user
INSERT INTO auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT
    u.id,
    u.id::text,
    u.id,
    jsonb_build_object(
        'sub', u.id::text,
        'email', 'admin@pmtool.local'
    ),
    'email',
    NOW(),
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'admin@pmtool.local'
AND NOT EXISTS (
    SELECT 1 FROM auth.identities i
    WHERE i.user_id = u.id AND i.provider = 'email'
);

-- ============================================
-- Verification
-- ============================================
-- Run this to verify the admin user was created:
SELECT email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'admin@pmtool.local';

-- You should see one row with:
-- email: admin@pmtool.local
-- created_at: (current timestamp)
-- email_confirmed_at: (current timestamp)

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now log in with:
-- Username: Admin
-- Password: 46344617
-- ============================================
