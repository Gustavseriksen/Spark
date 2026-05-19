"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          router.replace("/dashboard");
          return;
        }
        setChecked(true);
      })
      .catch(() => {
        setChecked(true);
      });
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
