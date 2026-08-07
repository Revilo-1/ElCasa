"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/");
      }
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Kunne ikke logge ind. Tjek e-mail og kodeord.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Noget gik galt under login. Prøv igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-plaster text-ink">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-stone/70 bg-white/80 px-4 py-2 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white">
                  <span className="text-sm font-semibold">T</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-ink/45">
                    Tværstræde 12
                  </p>
                  <p className="text-sm font-medium text-ink/70">
                    Projektoverblik
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-stone/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(43,38,32,0.08)] backdrop-blur sm:p-8">
              <div className="mb-6">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-terracotta">
                  Log ind
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
                  Velkommen tilbage
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ink/60 sm:text-base">
                  Log ind for at se opgaver, budget og indtægter for Tværstræde
                  12.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    E-mail
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-stone-dark/40 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    placeholder="din@mail.dk"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Kodeord
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-stone-dark/40 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                    placeholder="••••••••"
                  />
                </div>

                {message && (
                  <p className="rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-terracotta px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logger ind..." : "Log ind"}
                </button>
              </form>

              <p className="mt-4 text-xs leading-5 text-ink/45">
                Brug Supabase Auth med e-mail og kodeord. Spørg administratoren,
                hvis du mangler adgang.
              </p>
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[#17184A] lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,80,46,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,125,87,0.14),transparent_24%),linear-gradient(135deg,#17184A_0%,#1B204F_55%,#111331_100%)]" />
          <div className="absolute inset-0 opacity-[0.18]" />
          <div className="relative z-10 flex max-w-xl flex-col items-center px-10 text-center text-white">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-9 w-9 text-[#7AA2FF]"
                >
                  <path
                    d="M7 14.5V10m5 8V6m5 12v-3.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 14.5l7-7 3.5 3.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-display text-4xl font-semibold tracking-tight">
                  Tværstræde 12
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.3em] text-white/55">
                  Projektoverblik
                </p>
              </div>
            </div>

            <h2 className="max-w-lg font-display text-2xl font-semibold leading-tight text-white/95 sm:text-3xl">
              Alt samlet ét sted til opgaver, budget og fremdrift.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70">
              En enkel arbejdsflade til dig og teamet, bygget til både computer
              og telefon.
            </p>

            <div className="mt-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/8 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Opgaver
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">12</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Budget
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">OK</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Mobil
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">Ja</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
