-- RPC function to update account balance (checking or savings)
-- Takes a signed delta (positive for add, negative for withdraw)
-- Creates a transaction record and returns the updated account

CREATE OR REPLACE FUNCTION update_account_balance(
  p_account_type TEXT,
  p_amount NUMERIC,
  p_label TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  checking_balance NUMERIC,
  savings_balance NUMERIC,
  currency TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_account_id UUID;
  v_new_balance NUMERIC;
BEGIN
  -- Get the authenticated user's ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate account type
  IF p_account_type NOT IN ('checking', 'savings') THEN
    RAISE EXCEPTION 'Invalid account type. Must be "checking" or "savings"';
  END IF;

  -- Get or create the user's account
  INSERT INTO accounts (user_id, currency, checking_balance, savings_balance)
  VALUES (v_user_id, 'USD', 0, 0)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING accounts.id INTO v_account_id;

  -- If account already existed, get its ID
  IF v_account_id IS NULL THEN
    SELECT accounts.id INTO v_account_id
    FROM accounts
    WHERE accounts.user_id = v_user_id;
  END IF;

  -- Update the appropriate balance
  IF p_account_type = 'checking' THEN
    UPDATE accounts
    SET checking_balance = checking_balance + p_amount
    WHERE accounts.user_id = v_user_id
    RETURNING accounts.checking_balance INTO v_new_balance;
  ELSE
    UPDATE accounts
    SET savings_balance = savings_balance + p_amount
    WHERE accounts.user_id = v_user_id
    RETURNING accounts.savings_balance INTO v_new_balance;
  END IF;

  -- Check for negative balance
  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient funds. Operation would result in negative balance.';
  END IF;

  -- Insert transaction record
  INSERT INTO account_transactions (
    user_id,
    account_type,
    amount,
    date,
    label,
    note
  ) VALUES (
    v_user_id,
    p_account_type,
    p_amount,
    CURRENT_DATE,
    p_label,
    p_note
  );

  -- Return the updated account
  RETURN QUERY
  SELECT
    accounts.id,
    accounts.user_id,
    accounts.checking_balance,
    accounts.savings_balance,
    accounts.currency,
    accounts.created_at
  FROM accounts
  WHERE accounts.user_id = v_user_id;
END;
$$;
