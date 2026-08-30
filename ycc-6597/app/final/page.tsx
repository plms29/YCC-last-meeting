"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";
import { FINAL_CODE } from "@/data/event";

export default function FinalPage() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [wrong, setWrong] = useState(false);
  const [misses, setMisses] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const [ok, setOk] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const locked = lockLeft > 0;

  // dong ho cho man khoa 20 giay
  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => setLockLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [locked]);

  // het khoa -> tra con tro ve o dau, khong bat nguoi choi cham lai man hinh
  useEffect(() => {
    if (lockLeft !== 0) return;
    refs.current[0]?.focus();
  }, [lockLeft]);

  function setAt(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    setWrong(false);
    if (d && i < 3) refs.current[i + 1]?.focus();
    if (next.every((x) => x !== "")) check(next.join(""));
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function check(code: string) {
    if (locked) return;
    if (code === FINAL_CODE) {
      setOk(true);
      return;
    }
    const m = misses + 1;
    setMisses(m);
    setWrong(true);
    setDigits(["", "", "", ""]);
    if (m >= 3) {
      setMisses(0);
      setLockLeft(20);
    } else {
      setTimeout(() => refs.current[0]?.focus(), 320);
    }
  }

  if (ok) return <Reveal size="phone" />;

  return (
    <main className="bg-void relative min-h-dvh">
      <Starfield />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-6 py-12">
        <Image src="/mascot/astronaut.png" alt="Quan sát viên" width={200} height={200} priority />

        <div className="text-center">
          <p className="font-display text-signal text-[10px]">MA KHOI PHUC</p>
          <p className="text-dust mt-3 text-sm">Bốn chữ số. Chính là số ngày ta đã quan sát.</p>
        </div>

        <div className={`flex gap-3 ${wrong ? "shake" : ""}`}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={`px-input font-display h-20 w-16 text-center text-3xl ${
                wrong ? "border-alarm" : ""
              }`}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              disabled={locked}
              autoFocus={i === 0}
              aria-label={`Chữ số ${i + 1}`}
            />
          ))}
        </div>

        {locked ? (
          <p className="text-alarm text-center text-sm">
            Ta cần thời gian. Nghĩ lại đi.{" "}
            <span className="font-display ml-1">{lockLeft}s</span>
          </p>
        ) : wrong ? (
          <p className="text-alarm text-sm">Sai. Ta không nhớ con số đó.</p>
        ) : (
          <p className="text-dust text-sm">Y trước. C sau. C sau nữa. Ta chỉ biết cộng.</p>
        )}
      </div>
    </main>
  );
}
