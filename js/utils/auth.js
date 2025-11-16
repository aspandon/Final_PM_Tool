// js/utils/auth.js
// Authentication utility for checking login status and managing sessions

import { supabase } from './supabaseClient.js';

/**
 * Check if user is authenticated
 * Redirects to login page if not authenticated
 */
export const requireAuth = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error checking session:', error);
            redirectToLogin();
            return false;
        }

        if (!session) {
            console.log('No active session, redirecting to login');
            redirectToLogin();
            return false;
        }

        console.log('User authenticated:', session.user.email);
        return true;
    } catch (error) {
        console.error('Error in requireAuth:', error);
        redirectToLogin();
        return false;
    }
};

/**
 * Redirect to login page
 */
const redirectToLogin = () => {
    // Don't redirect if already on login page
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            return false;
        }
        console.log('User signed out successfully');
        window.location.href = 'login.html';
        return true;
    } catch (error) {
        console.error('Error in signOut:', error);
        return false;
    }
};

/**
 * Get current user information
 */
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('Error getting user:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
};

/**
 * Check if user is authenticated without redirecting
 */
export const isAuthenticated = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};
