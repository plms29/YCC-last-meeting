"use client";

import type { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import { MASKED_CODE } from "@/data/event";
import { findSlot } from "@/data/game";

export default function JoinPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // Lan sau mo lai thi vao thang /play/[slot].
  // Tru khi toi tu nut "Doi ma" (?doi=1) — nguoi giu 2 phong bi phai vao lai duoc.
  // Doc window.location thay vi useSearchParams de khong can boc Suspense.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("doi")) {
      localStorage.removeItem("ycc:slot");
      return;
    }
    const saved = localStorage.getItem("ycc:slot");
    if (saved && findSlot(saved)) router.replace(`/play/${saved}` as Route);
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const slot = findSlot(value);
    if (!slot) {
      setError("Không có mảnh nào mang mã đó.");
      return;
    }
    localStorage.setItem("ycc:slot", slot.id);
    router.push(`/play/${slot.id}` as Route);
  }

  return (
    <main className="bg-void relative min-h-dvh">
      <Starfield />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-6 py-12">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/mascot/astronaut-small.png"
            alt="Quan sát viên"
            width={96}
            height={96}
            priority
          />
          <p className="font-display text-signal text-[10px]">MA {MASKED_CODE}</p>
          <h1 className="text-dust text-center text-sm">
            Bộ nhớ của ta vỡ rồi. Ngươi giữ một mảnh.
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label htmlFor="slot" className="text-helmet text-sm">
            Mã trên phong bì của ngươi
          </label>
          <input
            id="slot"
            className={`px-input font-display w-full px-4 py-5 text-center text-2xl uppercase ${
              error ? "shake" : ""
            }`}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="Y1"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
          />
          {error && <p className="text-alarm text-sm">{error}</p>}
          <button type="submit" className="px-btn mt-2 px-4 py-4 text-base font-semibold">
            Mở mảnh
          </button>
        </form>

        <p className="text-dust text-xs leading-relaxed">
          Chấp nhận cả chữ thường: <span className="font-display">y1</span>,{" "}
          <span className="font-display">c1-3</span>,{" "}
          <span className="font-display">C2 4</span>.
        </p>
      </div>
    </main>
  );
}
