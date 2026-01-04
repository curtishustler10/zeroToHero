-- Grant execute permissions on the RPC function to authenticated users
GRANT EXECUTE ON FUNCTION update_account_balance(TEXT, NUMERIC, TEXT, TEXT) TO authenticated;

-- Enable RLS on accounts table (if not already enabled)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own account" ON accounts;
DROP POLICY IF EXISTS "Users can insert their own account" ON accounts;
DROP POLICY IF EXISTS "Users can update their own account" ON accounts;

-- Create RLS policies for accounts table
CREATE POLICY "Users can view their own account"
  ON accounts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own account"
  ON accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own account"
  ON accounts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on account_transactions table
ALTER TABLE account_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own transactions" ON account_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON account_transactions;

-- Create RLS policies for account_transactions table
CREATE POLICY "Users can view their own transactions"
  ON account_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON account_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
