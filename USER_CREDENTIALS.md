# PM Tool User Credentials

## How to Add Users to Supabase

1. Go to your Supabase dashboard: https://erumehpzdescjyfliceb.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase_add_users.sql` from this repository
5. Copy and paste the entire SQL script into the query editor
6. Click **Run** to execute the script
7. You should see "Success. No rows returned" message
8. Verify users were created by running the verification query at the end

## User Login Credentials

All users should log in using their email address (username@pmtool.local) and the password below:

| # | Username | Email | Password |
|---|----------|-------|----------|
| 1 | adrougkas | adrougkas@pmtool.local | f2jG4bm-NH#2 |
| 2 | akoletsis | akoletsis@pmtool.local | (K51OT[3koI< |
| 3 | ltsetsos | ltsetsos@pmtool.local | 9>7J90b3@7Mm |
| 4 | skonstantakopoulos | skonstantakopoulos@pmtool.local | MQX18\1\S7eb |
| 5 | aspanou | aspanou@pmtool.local | 988k1F:*0P&M |
| 6 | spapoutsi | spapoutsi@pmtool.local | 3Rc%w0VY47V5 |
| 7 | ikoutsogiannakopoulos | ikoutsogiannakopoulos@pmtool.local | a0bK4J-G!4r9 |
| 8 | gpeponis | gpeponis@pmtool.local | h08D6&N9Q=xk |

## Admin Credentials

| Username | Email | Password |
|----------|-------|----------|
| Admin | admin@pmtool.local | 46344617 |

## Notes

- All users have their email already confirmed and can log in immediately
- Users are non-admin by default and have standard access
- To change a user's password or delete a user, use the admin panel or run SQL queries in Supabase
- The SQL script prevents duplicate users - you can run it multiple times safely

## Verification Query

To verify all users were created successfully, run this in the Supabase SQL Editor:

```sql
SELECT
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data->>'username' as username
FROM auth.users
WHERE email LIKE '%@pmtool.local'
ORDER BY created_at DESC;
```

You should see 9 users total (8 new users + 1 admin).
