"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="D Mimo Architects" width={48} height={48} className="h-12 w-12" />
          <h1 className="mt-4 text-lg font-semibold tracking-wide text-neutral-900">D Mimo Admin</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage the studio website.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
