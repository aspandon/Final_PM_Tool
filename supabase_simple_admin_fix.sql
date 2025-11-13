-- ============================================
-- Simple Admin User Fix
-- ============================================
-- Simplified script that avoids UUID type issues
-- ============================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete admin user and let cascading deletes handle related records
DELETE FROM auth.users WHERE email = 'admin@pmtool.local';

-- Verify deletion
SELECT 'Admin user deleted' as status;

-- Create new admin user with proper password
DO $$
DECLARE
    new_admin_id UUID;
BEGIN
    -- Generate new UUID
    new_admin_id := gen_random_uuid();

    -- Insert the admin user
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
        new_admin_id,
        'authenticated',
        'authenticated',
        'admin@pmtool.local',
        crypt('46344617', gen_salt('bf')),
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
        '{"username":"Admin"}'::jsonb,
        false,
        NULL
    );

    -- Create identity for the user
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
        new_admin_id,
        new_admin_id::text,
        new_admin_id,
        jsonb_build_object(
            'sub', new_admin_id::text,
            'email', 'admin@pmtool.local',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NULL,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created with ID: %', new_admin_id;
END $$;

-- Verify the admin user was created
SELECT
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data->>'username' as username
FROM auth.users
WHERE email = 'admin@pmtool.local';

-- Verify identity was created
SELECT
    i.provider,
    u.email
FROM auth.identities i
JOIN auth.users u ON i.user_id = u.id
WHERE u.email = 'admin@pmtool.local';

-- ============================================
-- DONE!
-- ============================================
-- Username: Admin
-- Password: 46344617
-- ============================================
