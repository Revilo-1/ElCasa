"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(pathname !== "/signin");

  useEffect(() => {
    if (pathname === "/signin") {
      setCheckingAuth(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (!data.user) {
        router.replace("/signin");
        return;
      }

      setCheckingAuth(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session && pathname !== "/signin") {
        router.replace("/signin");
        return;
      }

      if (session) {
        setCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (pathname === "/signin") {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-plaster text-sm text-ink/50">
        Tjekker login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-5 sm:py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
