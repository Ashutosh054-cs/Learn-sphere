# Fix Email Confirmation Issue

## Current Problem
Users cannot login after signup because Supabase requires email confirmation, but emails aren't being received.

## Solution Steps

### Option 1: Disable Email Confirmation (Recommended for Development)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `lrnbfmafelgcdyqvvzas`
3. **Navigate to**: Authentication → Providers → Email
4. **Find "Confirm email"** toggle
5. **Turn it OFF** (uncheck the box)
6. **Click "Save"**

### Option 2: Use SQL to Auto-Confirm Users

Run this SQL in your Supabase SQL Editor to manually confirm existing users:

```sql
-- Confirm all existing users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

### Option 3: Disable Email Confirmation via SQL

Run this in Supabase SQL Editor:

```sql
-- Update auth config to disable email confirmation
UPDATE auth.config
SET confirm_email_enabled = false;
```

## Test After Changes

1. **Delete your test account** (if exists):
   - Go to Supabase Dashboard → Authentication → Users
   - Delete any test users you created

2. **Try signup again** with a new email

3. **Should work immediately** without needing email confirmation

## Verify Current Settings

Run this SQL to check current auth settings:

```sql
SELECT * FROM auth.config;
```

Look for `confirm_email_enabled` - it should be `false`.

## If Still Not Working

The Supabase dashboard settings might be cached. Try:
1. **Hard refresh** your app (Ctrl + Shift + R)
2. **Clear browser cache**
3. **Restart dev server**: 
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
