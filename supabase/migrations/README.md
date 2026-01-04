# Database Migrations

## Running Migrations

To apply the database migrations to your Supabase project:

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xzqaqvalgqcprwaqsraa
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `20260104_update_account_balance.sql`
5. Click **Run** to execute the migration

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
cd web
supabase db push
```

## Migration: update_account_balance

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
