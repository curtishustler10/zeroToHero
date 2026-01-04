# Database Migrations

## Running Migrations

To apply the database migrations to your Supabase project:

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xzqaqvalgqcprwaqsraa
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Run migrations in order:
   - First: `20260104_update_account_balance.sql`
   - Second: `20260104_rls_and_permissions.sql`
5. Click **Run** to execute each migration

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
cd web
supabase db push
```

## Migration 1: update_account_balance

This migration creates an RPC function that:
- Updates checking or savings balance with a signed delta (+ for add, - for withdraw)
- Validates the account type
- Prevents negative balances
- Creates a transaction record in `account_transactions`
- Returns the updated account data

**Usage:**
```javascript
const { data, error } = await supabase.rpc('update_account_balance', {
  p_account_type: 'checking', // or 'savings'
  p_amount: 100, // positive to add, negative to withdraw
  p_label: 'Deposit', // optional
  p_note: 'Monthly savings' // optional
});
```

## Migration 2: rls_and_permissions

This migration:
- Grants execute permissions on the RPC function to authenticated users
- Enables Row Level Security (RLS) on accounts and account_transactions tables
- Creates policies allowing users to view/insert/update their own data only
- Ensures proper data isolation between users
