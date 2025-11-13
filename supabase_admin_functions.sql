-- ============================================
-- Supabase Admin Functions for User Management
-- ============================================
-- This script creates admin functions for managing users
-- Run this in the Supabase SQL Editor after authentication setup
-- ============================================

-- IMPORTANT: You must run this in the Supabase SQL Editor
-- Go to: https://erumehpzdescjyfliceb.supabase.co
-- Click: SQL Editor → New Query
-- Paste this entire script and click Run

-- ============================================
-- Enable Required Extensions
-- ============================================
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Make sure extensions schema is in search path
ALTER DATABASE postgres SET search_path TO public, extensions;

-- ============================================
-- Function 1: List All Users
-- ============================================
-- Returns all users with their details for the admin panel
CREATE OR REPLACE FUNCTION admin_list_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    created_at TIMESTAMPTZ,
    raw_user_meta_data JSONB
)
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only allow admin user to list users
    IF (SELECT auth.jwt()->>'email') != 'admin@pmtool.local' THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    RETURN QUERY
    SELECT
        u.id,
        u.email,
        u.created_at,
        u.raw_user_meta_data
    FROM auth.users u
    ORDER BY u.created_at DESC;
END;
$$;

-- ============================================
-- Function 2: Create New User
-- ============================================
-- Creates a new user with email, password, and metadata
CREATE OR REPLACE FUNCTION admin_create_user(
    user_email TEXT,
    user_password TEXT,
    user_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id UUID;
    result JSONB;
BEGIN
    -- Only allow admin user to create users
    IF (SELECT auth.jwt()->>'email') != 'admin@pmtool.local' THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    -- Check if user already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
        RAISE EXCEPTION 'User with email % already exists', user_email;
    END IF;

    -- Generate new user ID
    new_user_id := gen_random_uuid();

    -- Insert new user into auth.users
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
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        user_email,
        crypt(user_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '{"provider":"email","providers":["email"]}'::JSONB,
        user_metadata
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
        new_user_id,
        new_user_id::text,
        new_user_id,
        jsonb_build_object(
            'sub', new_user_id::text,
            'email', user_email
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    );

    -- Return success
    result := jsonb_build_object(
        'success', true,
        'user_id', new_user_id,
        'email', user_email
    );

    RETURN result;
END;
$$;

-- ============================================
-- Function 3: Update User
-- ============================================
-- Updates user password and/or metadata
CREATE OR REPLACE FUNCTION admin_update_user(
    user_id UUID,
    user_password TEXT DEFAULT NULL,
    user_metadata JSONB DEFAULT NULL
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Only allow admin user to update users
    IF (SELECT auth.jwt()->>'email') != 'admin@pmtool.local' THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
        RAISE EXCEPTION 'User with ID % not found', user_id;
    END IF;

    -- Update password if provided
    IF user_password IS NOT NULL THEN
        UPDATE auth.users
        SET
            encrypted_password = crypt(user_password, gen_salt('bf')),
            updated_at = NOW()
        WHERE id = user_id;
    END IF;

    -- Update metadata if provided
    IF user_metadata IS NOT NULL THEN
        UPDATE auth.users
        SET
            raw_user_meta_data = user_metadata,
            updated_at = NOW()
        WHERE id = user_id;
    END IF;

    -- Return success
    result := jsonb_build_object(
        'success', true,
        'user_id', user_id
    );

    RETURN result;
END;
$$;

-- ============================================
-- Function 4: Delete User
-- ============================================
-- Deletes a user and their identity
CREATE OR REPLACE FUNCTION admin_delete_user(
    user_id UUID
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
    user_email TEXT;
    result JSONB;
BEGIN
    -- Only allow admin user to delete users
    IF (SELECT auth.jwt()->>'email') != 'admin@pmtool.local' THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    -- Get user email before deletion
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_id;

    -- Check if user exists
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'User with ID % not found', user_id;
    END IF;

    -- Prevent deletion of admin user
    IF user_email = 'admin@pmtool.local' THEN
        RAISE EXCEPTION 'Cannot delete admin user';
    END IF;

    -- Delete user identities first (foreign key constraint)
    DELETE FROM auth.identities
    WHERE user_id = user_id;

    -- Delete the user
    DELETE FROM auth.users
    WHERE id = user_id;

    -- Return success
    result := jsonb_build_object(
        'success', true,
        'user_id', user_id,
        'email', user_email
    );

    RETURN result;
END;
$$;

-- ============================================
-- Grant Execute Permissions
-- ============================================
-- Allow authenticated users to execute these functions
-- (The functions themselves check for admin status)
GRANT EXECUTE ON FUNCTION admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_user(TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the functions were created successfully:

-- 1. Check that functions exist
SELECT
    proname as function_name,
    pronargs as num_arguments
FROM pg_proc
WHERE proname LIKE 'admin_%'
ORDER BY proname;

-- 2. Test list users (must be logged in as admin)
-- SELECT * FROM admin_list_users();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your admin panel should now work with these functions:
-- - admin_list_users() - View all users
-- - admin_create_user() - Create new users
-- - admin_update_user() - Update user credentials
-- - admin_delete_user() - Delete users
-- ============================================
