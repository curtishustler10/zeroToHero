'use client';

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types";
import { Loader2, Plus, Minus } from "lucide-react";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user found");
      setLoading(false);
      return;
    }

    console.log("Fetching account for user:", user.id);

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log("Account fetch result:", { data, error });

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching account:", error);
      setLoading(false);
    } else if (data) {
      console.log("Account found:", data);
      setAccount(data);
      setLoading(false);
    } else {
      // Create account if it doesn't exist
      console.log("Creating new account for user");
      const { data: newAccount, error: insertError } = await supabase
        .from("accounts")
        .insert({ user_id: user.id, currency: "USD", checking_balance: 0, savings_balance: 0 })
        .select()
        .single();

      console.log("Account creation result:", { newAccount, insertError });

      if (newAccount) setAccount(newAccount);
      setLoading(false);
    }
  };

  const updateBalance = async (accountType: "checking" | "savings", amount: number) => {
    const label = amount > 0 ? "Add" : "Withdraw";
    setUpdating(accountType);

    try {
      console.log("Calling RPC with:", { p_account_type: accountType, p_amount: amount, p_label: label }); // Debug
      const { data, error } = await supabase.rpc("update_account_balance", {
        p_account_type: accountType,
        p_amount: amount,
        p_label: label,
      });

      console.log("RPC response:", { data, error }); // Debug

      if (error) throw error;

      if (data && data.length > 0) {
        setAccount(data[0]);
        alert(`Successfully ${label.toLowerCase()}ed $${Math.abs(amount).toFixed(2)}`);
      } else {
        console.warn("No data returned from RPC");
        // Refresh account data
        await fetchAccount();
      }
    } catch (error: any) {
      console.error("Update balance error:", error); // Debug
      alert(error.message || "Failed to update balance");
    } finally {
      setUpdating(null);
    }
  };

  const handleQuickAmount = async (accountType: "checking" | "savings", delta: number) => {
    console.log("Button clicked:", accountType, delta); // Debug log
    const amountStr = prompt(`Enter amount to ${delta > 0 ? "add" : "withdraw"}:`);
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    console.log("Calling updateBalance with:", accountType, delta * amount); // Debug log
    await updateBalance(accountType, delta * amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[--muted]">You</p>
          <h1 className="text-2xl font-semibold text-[--foreground]">Account & Settings</h1>
        </div>
      </header>

      {/* Checking Account */}
      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[--muted]">Checking</p>
            <p className="text-2xl font-bold text-[--foreground]">
              ${account?.checking_balance.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickAmount("checking", 1)}
              disabled={updating === "checking"}
              className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {updating === "checking" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              Add
            </button>
            <button
              onClick={() => handleQuickAmount("checking", -1)}
              disabled={updating === "checking"}
              className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
            >
              {updating === "checking" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              Withdraw
            </button>
          </div>
        </div>
      </section>

      {/* Savings Account */}
      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[--muted]">Savings</p>
            <p className="text-2xl font-bold text-[--foreground]">
              ${account?.savings_balance.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickAmount("savings", 1)}
              disabled={updating === "savings"}
              className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {updating === "savings" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              Add
            </button>
            <button
              onClick={() => handleQuickAmount("savings", -1)}
              disabled={updating === "savings"}
              className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
            >
              {updating === "savings" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              Withdraw
            </button>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Profile</p>
            <p className="text-xs text-[--muted]">Manage name, email, and notifications.</p>
          </div>
          <span className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
            Edit
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Data & Export</p>
            <p className="text-xs text-[--muted]">Export your data or clear local cache.</p>
          </div>
          <span className="rounded-full bg-[--gray-soft] px-3 py-1 text-xs font-semibold text-gray-700">
            Manage
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[--foreground]">Appearance</p>
            <p className="text-xs text-[--muted]">Light theme for now. Dark mode coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
