'use client';

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  const supabase = createSupabaseBrowserClient();

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error: signError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (signError) {
      setError(signError.message);
    } else {
      setMessage("Check your email for the magic link.");
    }
    setLoading(false);
  };

  const redirectedFrom = params.get("redirectedFrom");

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-4 py-10 text-[--foreground]">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="card p-5">
        <p className="text-xs font-semibold uppercase text-[--muted]">Zero To Hero</p>
        <h1 className="mt-1 text-2xl font-semibold">Sign in</h1>
        {redirectedFrom && (
          <p className="mt-1 text-xs text-[--muted]">Redirected from {redirectedFrom}</p>
        )}

        <form onSubmit={handleMagicLink} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold text-[--foreground]">
            Email
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-sm outline-none"
                placeholder="you@example.com"
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send magic link
          </button>
        </form>

        {message && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
