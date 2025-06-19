"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) setErrorMsg(error.message);
    else router.push("/");
  };

  return (
    <div className="max-w-md mt-24 h-[70vh] flex justify-center items-center flex-col mx-auto p-8 bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
      {errorMsg && <div className="mb-4 text-[var(--red)]">{errorMsg}</div>}
      <form onSubmit={handleLogin} className="space-y-4 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full px-4 py-2 border border-[var(--foreground)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full px-4 py-2 border border-[var(--foreground)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded-md flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-[var(--background)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
