-- ============================================
-- Add Non-Admin Users to PM Tool
-- ============================================
-- This script adds 8 non-admin users to the system
-- Run this in the Supabase SQL Editor
-- ============================================

-- IMPORTANT: You must run this in the Supabase SQL Editor
-- Go to: https://erumehpzdescjyfliceb.supabase.co
-- Click: SQL Editor → New Query
-- Paste this entire script and click Run

-- ============================================
-- Ensure pgcrypto extension is enabled
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Add User 1: adrougkas
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- Insert user
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
        new_user_id,
        'authenticated',
        'authenticated',
        'adrougkas@pmtool.local',
        crypt('f2jG4bm-NH#2', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"adrougkas"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'adrougkas@pmtool.local'
    );

    -- Insert identity
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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'adrougkas@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'adrougkas@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 2: akoletsis
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'akoletsis@pmtool.local',
        crypt('(K51OT[3koI<', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"akoletsis"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'akoletsis@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'akoletsis@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'akoletsis@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 3: ltsetsos
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'ltsetsos@pmtool.local',
        crypt('9>7J90b3@7Mm', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"ltsetsos"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'ltsetsos@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'ltsetsos@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'ltsetsos@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 4: skonstantakopoulos
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'skonstantakopoulos@pmtool.local',
        crypt(E'MQX18\\1\\S7eb', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"skonstantakopoulos"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'skonstantakopoulos@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'skonstantakopoulos@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'skonstantakopoulos@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 5: aspanou
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'aspanou@pmtool.local',
        crypt('988k1F:*0P&M', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"aspanou"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'aspanou@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'aspanou@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'aspanou@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 6: spapoutsi
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'spapoutsi@pmtool.local',
        crypt('3Rc%w0VY47V5', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"spapoutsi"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'spapoutsi@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'spapoutsi@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'spapoutsi@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 7: ikoutsogiannakopoulos
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'ikoutsogiannakopoulos@pmtool.local',
        crypt('a0bK4J-G!4r9', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"ikoutsogiannakopoulos"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'ikoutsogiannakopoulos@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'ikoutsogiannakopoulos@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'ikoutsogiannakopoulos@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Add User 8: gpeponis
-- ============================================
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
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
        new_user_id,
        'authenticated',
        'authenticated',
        'gpeponis@pmtool.local',
        crypt('h08D6&N9Q=xk', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}',
        '{"username":"gpeponis"}'
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'gpeponis@pmtool.local'
    );

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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'gpeponis@pmtool.local'
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.identities i
        JOIN auth.users u ON i.user_id = u.id
        WHERE u.email = 'gpeponis@pmtool.local' AND i.provider = 'email'
    );
END $$;

-- ============================================
-- Verification
-- ============================================
-- Run this to verify all users were created:
SELECT
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data->>'username' as username
FROM auth.users
WHERE email LIKE '%@pmtool.local'
ORDER BY created_at DESC;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You should now see 9 users total (8 new + 1 admin):
--
-- User credentials for login:
-- 1. Email: adrougkas@pmtool.local          | Password: f2jG4bm-NH#2
-- 2. Email: akoletsis@pmtool.local          | Password: (K51OT[3koI<
-- 3. Email: ltsetsos@pmtool.local           | Password: 9>7J90b3@7Mm
-- 4. Email: skonstantakopoulos@pmtool.local | Password: MQX18\1\S7eb
-- 5. Email: aspanou@pmtool.local            | Password: 988k1F:*0P&M
-- 6. Email: spapoutsi@pmtool.local          | Password: 3Rc%w0VY47V5
-- 7. Email: ikoutsogiannakopoulos@pmtool.local | Password: a0bK4J-G!4r9
-- 8. Email: gpeponis@pmtool.local           | Password: h08D6&N9Q=xk
-- ============================================
