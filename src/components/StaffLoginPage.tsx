"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/staff");
      }
    }

    checkSession();
  }, [router]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        throw new Error("Staff login is not configured.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.replace("/staff");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e7dfd2] px-6 text-[#11100d]">
      <section className="w-full max-w-[520px] border-y border-[#2d261f]/15 py-10">
        <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.36em]">
          <Link href="/">Noirtable</Link>
          <Link href="/menu">Menu</Link>
        </div>

        <p className="mt-14 text-[9px] font-semibold uppercase tracking-[0.36em] text-[#11100d]/52">
          Staff desk
        </p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.92]">
          Evening room login.
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-7 text-[#11100d]/66">
          Orders and table requests for the team.
        </p>

        <form onSubmit={submitLogin} className="mt-10 grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.24em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="h-14 border border-[#2d261f]/18 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.24em] outline-none placeholder:text-[#11100d]/48 focus:border-[#11100d]/45"
          />
          <button
            disabled={isSubmitting}
            className="h-14 bg-[#c2a16e] text-[9px] font-semibold uppercase tracking-[0.34em] text-[#11100d] transition hover:bg-[#b9935f] disabled:opacity-60"
          >
            {isSubmitting ? "Signing in" : "Open staff desk"}
          </button>
          {status ? (
            <p className="border border-[#2d261f]/18 px-5 py-4 text-sm leading-6 text-[#11100d]/68">
              {status}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
