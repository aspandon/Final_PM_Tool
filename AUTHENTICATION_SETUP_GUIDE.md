# Authentication Setup Guide

## Overview
Your PM Tool and Action Items Tracker now require login authentication. All pages are protected and will redirect to the login page if the user is not authenticated.

## 🔐 Login Credentials

**Username:** `Admin`
**Password:** `46344617`

## 🚀 Setup Steps (REQUIRED)

### Step 1: Enable Email Authentication in Supabase

1. Go to your Supabase dashboard: https://erumehpzdescjyfliceb.supabase.co
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"** tab
4. Find **"Email"** provider and click to expand
5. Toggle **"Enable Email provider"** to ON
6. **IMPORTANT:** Scroll down and toggle **"Confirm email"** to OFF
   - This allows login without email verification
   - Makes setup much simpler
7. Click **"Save"**

### Step 2: Create Admin User

#### Option A: Automatic Setup (Recommended)

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file `supabase_auth_setup.sql` from this project
5. **Copy the entire SQL script** and paste into the editor
6. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
7. You should see: "Success. 2 rows returned" (or similar)
8. **Verify** by running this query:
   ```sql
   SELECT email, created_at FROM auth.users WHERE email = 'admin@pmtool.local';
   ```
9. You should see the admin user in the results

#### Option B: Manual Setup via Dashboard

1. Go to Supabase dashboard → **"Authentication"** → **"Users"**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email:** `admin@pmtool.local`
   - **Password:** `46344617`
   - **Auto Confirm User:** ✅ Check this box
4. Click **"Create user"**

### Step 3: Setup Admin Functions (REQUIRED for Admin Panel)

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file `supabase_admin_functions.sql` from this project
5. **Copy the entire SQL script** and paste into the editor
6. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
7. You should see: "Success. Rows returned" (verifying functions were created)
8. **Verify** by running this query:
   ```sql
   SELECT proname as function_name, pronargs as num_arguments
   FROM pg_proc
   WHERE proname LIKE 'admin_%'
   ORDER BY proname;
   ```
9. You should see 4 functions listed: admin_list_users, admin_create_user, admin_update_user, admin_delete_user

### Step 4: Deploy Updated Files

1. Extract the latest deployment ZIP to your web server
2. Make sure these new files are uploaded:
   - `login.html` (new login page)
   - `admin.html` (new admin panel)
   - `js/utils/auth.js` (new auth utility)
   - Updated `index.html`, `pmtool.html`, `actions.html`

### Step 5: Test the Login

1. Open your website (e.g., `https://yoursite.com`)
2. You should be **automatically redirected** to `login.html`
3. Enter:
   - **Username:** `Admin`
   - **Password:** `46344617`
4. Click **"Sign In"**
5. You should be redirected to the main hub (`index.html`)
6. You should see a **"Sign Out"** button at the bottom

## 📋 How It Works

### Authentication Flow

```
User visits any page
       ↓
Check if logged in (Supabase session)
       ↓
Not logged in? → Redirect to login.html
       ↓
User enters credentials
       ↓
Supabase validates username/password
       ↓
Success! → Create session → Redirect to requested page
```

### Protected Pages

All pages are now protected:
- ✅ `index.html` - Main hub (requires login)
- ✅ `pmtool.html` - PM Tool (requires login)
- ✅ `actions.html` - Action Items (requires login)
- 🔓 `login.html` - Login page (public)

### Session Management

- **Sessions last:** 7 days (Supabase default)
- **Auto-refresh:** Yes, sessions refresh automatically
- **Multi-device:** Yes, can be logged in on multiple devices
- **Sign out:** Clears session from all devices

## 🎨 Features

### Login Page
- Clean, modern design matching your app
- Gradient header with PM Tool branding
- Username and password fields
- Error messages for invalid credentials
- Auto-focus on username field
- "Remember me" via Supabase session

### Sign Out Button
- Located at bottom of main hub page
- Confirmation dialog before signing out
- Redirects to login page after sign out

### Security
- ✅ All pages require authentication
- ✅ Sessions stored securely in Supabase
- ✅ Passwords encrypted with bcrypt
- ✅ Automatic session refresh
- ✅ Session expires after 7 days of inactivity

## 🔧 Technical Details

### Username to Email Conversion

The login system converts usernames to email format:
- **Username entered:** `Admin`
- **Stored in Supabase:** `admin@pmtool.local`
- This allows Supabase Auth (which requires email) to work with username-based login

### Files Modified

**New Files:**
- `login.html` - Login page
- `js/utils/auth.js` - Authentication utilities
- `supabase_auth_setup.sql` - SQL script to create admin user
- `AUTHENTICATION_SETUP_GUIDE.md` - This guide

**Modified Files:**
- `index.html` - Added auth check and logout button
- `pmtool.html` - Added auth check
- `actions.html` - Added auth check

### Authentication Functions

The `js/utils/auth.js` file provides:
- `requireAuth()` - Check if user is logged in, redirect if not
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current user information
- `isAuthenticated()` - Check auth without redirect

## 🔐 Admin Panel

### Accessing the Admin Panel

1. Log in as Admin (Username: Admin, Password: 46344617)
2. From the main hub (index.html), you'll see a discreet **"🔐 Admin"** link in the footer
3. This link is **only visible to the admin user**
4. Click the Admin link to access the admin panel

### Admin Panel Features

The Admin Panel (`admin.html`) allows you to:

- ✅ **View all users** - See username, full name, email, and creation date
- ✅ **Add new users** - Create users with username, full name, and password
- ✅ **Edit users** - Update passwords and full names
- ✅ **Delete users** - Remove users (cannot delete admin account)

### Adding Users via Admin Panel

1. Access the admin panel
2. Fill in the "Add New User" form:
   - **Username**: Required (e.g., "JohnDoe")
   - **Full Name**: Optional display name (e.g., "John Doe")
   - **Password**: Required, minimum 6 characters
3. Click **"Add User"**
4. The user can now log in with their username and password

### Managing Existing Users

**To Edit a User:**
1. Click the **"Edit"** button next to the user
2. Enter new password (leave blank to keep current)
3. Enter new full name
4. Click OK to confirm

**To Delete a User:**
1. Click the **"Delete"** button next to the user
2. Confirm the deletion
3. User will be permanently removed (cannot be undone)

**Note:** The admin account cannot be edited or deleted from the admin panel.

## 👥 Adding More Users (Optional)

If you prefer to add users manually instead of using the Admin Panel:

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email (e.g., `john@pmtool.local`) and password
4. Check **"Auto Confirm User"**
5. They can log in with username `john`

### Via SQL:
```sql
INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at, confirmation_token,
    raw_app_meta_data, raw_user_meta_data
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'username@pmtool.local',  -- Change this
    crypt('password123', gen_salt('bf')),  -- Change this
    NOW(), NOW(), NOW(), '',
    '{"provider":"email","providers":["email"]}',
    '{"username":"Username"}'  -- Change this
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'username@pmtool.local'
);
```

## 🧪 Testing Checklist

After setup, verify these work:

### Basic Authentication
- [ ] Opening `index.html` redirects to login page
- [ ] Opening `pmtool.html` redirects to login page
- [ ] Opening `actions.html` redirects to login page
- [ ] Can log in with Admin/46344617
- [ ] After login, redirected to main hub
- [ ] Can access PM Tool from hub
- [ ] Can access Action Items from hub
- [ ] "Sign Out" button appears on main hub
- [ ] Clicking "Sign Out" logs out and redirects to login
- [ ] After logout, pages redirect to login again

### Admin Panel
- [ ] "🔐 Admin" link appears in footer when logged in as Admin
- [ ] Clicking Admin link opens admin panel
- [ ] Admin panel shows list of existing users
- [ ] Can add new user through admin panel
- [ ] New user can log in with created credentials
- [ ] Can edit existing user's password and name
- [ ] Can delete non-admin users
- [ ] Cannot delete admin account (protected)
- [ ] Non-admin users cannot access admin panel (if trying direct URL)

## 🐛 Troubleshooting

### "Invalid username or password" error

**Check:**
1. Did you run the SQL setup script?
2. Is Email provider enabled in Supabase?
3. Is "Confirm email" disabled?
4. Try checking if user exists:
   ```sql
   SELECT email FROM auth.users WHERE email = 'admin@pmtool.local';
   ```

**Fix:**
- Re-run the `supabase_auth_setup.sql` script
- OR manually create user via Dashboard (Option B above)

### Redirects not working

**Check:**
1. Are you using a modern browser?
2. Is JavaScript enabled?
3. Check browser console (F12) for errors
4. Is Supabase client library loading?

**Fix:**
- Clear browser cache
- Check that `js/utils/auth.js` exists
- Verify Supabase CDN is accessible

### "Session not found" error

**Check:**
1. Did session expire?
2. Did you clear cookies/localStorage?

**Fix:**
- Simply log in again
- Sessions last 7 days, will auto-refresh if you use the app

### Can't access Supabase

**Check:**
1. Is internet connection working?
2. Is Supabase service up? (check status.supabase.com)
3. Are there firewall/proxy issues?

**Fix:**
- App will fall back to localStorage if Supabase is down
- Authentication requires Supabase to be accessible

### Admin panel errors

**"Error loading users" or functions not found:**

**Check:**
1. Did you run the `supabase_admin_functions.sql` script?
2. Are the functions created in Supabase?
3. Verify with this query:
   ```sql
   SELECT proname FROM pg_proc WHERE proname LIKE 'admin_%';
   ```

**Fix:**
- Run the `supabase_admin_functions.sql` script in Supabase SQL Editor
- Make sure all 4 functions are created successfully

**"Access denied: Admin only" error:**

**Check:**
1. Are you logged in as admin@pmtool.local?
2. Check current user email in browser console

**Fix:**
- Log out and log back in with Admin credentials
- The functions check JWT token for admin email

**Admin link not showing:**

**Check:**
1. Are you logged in as Admin user?
2. Check browser console for JavaScript errors
3. Is `getCurrentUser()` working?

**Fix:**
- Clear browser cache and refresh
- Log out and log in again
- Check that `js/utils/auth.js` is properly loaded

## 🔒 Security Best Practices

### Current Setup (Good for Internal Use)
- ✅ Password-protected
- ✅ Session-based authentication
- ✅ Encrypted password storage
- ✅ Auto-logout after 7 days

### For Production/Public Use (Recommended Upgrades)
- 🔐 Enable email confirmation
- 🔐 Add password reset functionality
- 🔐 Enable multi-factor authentication (MFA)
- 🔐 Use environment variables for keys
- 🔐 Add rate limiting on login attempts
- 🔐 Implement role-based access control (RBAC)

## 📧 Changing Admin Password

To change the admin password:

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Find `admin@pmtool.local`
3. Click on the user
4. Enter new password
5. Click **"Update user"**

### Via SQL:
```sql
UPDATE auth.users
SET encrypted_password = crypt('NEW_PASSWORD_HERE', gen_salt('bf'))
WHERE email = 'admin@pmtool.local';
```

## 🎯 Summary

You now have:
- ✅ Secure login page
- ✅ All pages protected by authentication
- ✅ Admin user: Admin / 46344617
- ✅ Sign out functionality
- ✅ Session management via Supabase
- ✅ Automatic redirects for unauthorized access
- ✅ Admin panel for user management
- ✅ Create, edit, and delete user accounts

**Next Steps:**
1. Run the authentication setup SQL (`supabase_auth_setup.sql`)
2. Run the admin functions SQL (`supabase_admin_functions.sql`)
3. Deploy updated files to web server
4. Test login functionality
5. Access admin panel and create additional users
6. Start using your secured PM Tool!

---

**Need Help?** Check the troubleshooting section or review your Supabase dashboard for auth status.
