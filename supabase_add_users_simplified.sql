-- ============================================
-- Simple User Creation Script
-- ============================================
-- Simplified script that avoids UUID type issues
-- Creates 8 non-admin users
-- ============================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Delete existing users if they exist (to avoid duplicates)
-- ============================================
DELETE FROM auth.users WHERE email IN (
    'adrougkas@pmtool.local',
    'akoletsis@pmtool.local',
    'ltsetsos@pmtool.local',
    'skonstantakopoulos@pmtool.local',
    'aspanou@pmtool.local',
    'spapoutsi@pmtool.local',
    'ikoutsogiannakopoulos@pmtool.local',
    'gpeponis@pmtool.local'
);

-- ============================================
-- Add User 1: adrougkas
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'adrougkas@pmtool.local',
        crypt('f2jG4bm-NH#2', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"adrougkas"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'adrougkas@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User adrougkas created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 2: akoletsis
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'akoletsis@pmtool.local',
        crypt('(K51OT[3koI<', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"akoletsis"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'akoletsis@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User akoletsis created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 3: ltsetsos
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'ltsetsos@pmtool.local',
        crypt('9>7J90b3@7Mm', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"ltsetsos"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'ltsetsos@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User ltsetsos created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 4: skonstantakopoulos
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'skonstantakopoulos@pmtool.local',
        crypt(E'MQX18\\1\\S7eb', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"skonstantakopoulos"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'skonstantakopoulos@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User skonstantakopoulos created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 5: aspanou
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'aspanou@pmtool.local',
        crypt('988k1F:*0P&M', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"aspanou"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'aspanou@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User aspanou created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 6: spapoutsi
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'spapoutsi@pmtool.local',
        crypt('3Rc%w0VY47V5', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"spapoutsi"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'spapoutsi@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User spapoutsi created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 7: ikoutsogiannakopoulos
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'ikoutsogiannakopoulos@pmtool.local',
        crypt('a0bK4J-G!4r9', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"ikoutsogiannakopoulos"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'ikoutsogiannakopoulos@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User ikoutsogiannakopoulos created with ID: %', new_user_id;
END $$;

-- ============================================
-- Add User 8: gpeponis
-- ============================================
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        'gpeponis@pmtool.local',
        crypt('h08D6&N9Q=xk', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"username":"gpeponis"}'::jsonb,
        false,
        NULL
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
    VALUES (
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', 'gpeponis@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'User gpeponis created with ID: %', new_user_id;
END $$;

-- ============================================
-- Verification
-- ============================================
-- Verify all users were created
SELECT
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data->>'username' as username
FROM auth.users
WHERE email LIKE '%@pmtool.local'
ORDER BY created_at DESC;

-- Verify identities were created
SELECT
    i.provider,
    u.email,
    u.raw_user_meta_data->>'username' as username
FROM auth.identities i
JOIN auth.users u ON i.user_id = u.id
WHERE u.email LIKE '%@pmtool.local'
ORDER BY u.email;

-- ============================================
-- DONE!
-- ============================================
-- All 8 users have been created successfully!
-- They can now log in with their email and password.
-- ============================================
