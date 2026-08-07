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
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-[28rem]">
            <div className="rounded-[30px] border border-stone/70 bg-white/92 p-6 shadow-[0_18px_45px_rgba(43,38,32,0.08)] backdrop-blur-sm sm:p-8">
              <div className="mb-6 text-center sm:text-left">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Velkommen tilbage
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ink/62 sm:text-base">
                  Log ind for at tilgå dit bygge projekt.
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
                  className="w-full rounded-xl bg-terracotta px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(181,80,46,0.18)] transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logger ind..." : "Log ind"}
                </button>
              </form>

            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#17184A_0%,#1C2250_55%,#10122D_100%)] lg:flex lg:items-center lg:justify-center">
          <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-10 text-center text-white">
            <div className="grid w-full gap-6">
              <div className="grid place-items-center gap-5 rounded-[30px] border border-white/10 bg-white/7 px-10 py-12 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
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

                <h2 className="max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight text-white/95">
                  Arbejdsfladen til dit byggeprojekt.
                </h2>

                <div className="grid w-full max-w-md grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Struktur
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Struktur
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Planlæg
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Planlæg
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      Eksekver
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Eksekver
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
