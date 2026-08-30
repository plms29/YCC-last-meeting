"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DIGIT_SUM, FINAL_CODE, TOTAL_DAYS, vn } from "@/data/event";

type Seg = { t: string; mono?: boolean };

/**
 * Chuoi reveal · SPEC muc 8.
 * Moi dong hien sau dong truoc 1.4 giay. Dong cuoi bat 4 mau logo YCC —
 * day la lan duy nhat ca app dung mau.
 * Quy tac font: co dau -> Be Vietnam Pro; so va ma -> Press Start 2P.
 */
function buildLines(): Seg[][] {
  const digits = [...FINAL_CODE].join(" + ");
  const lines: Seg[][] = [
    [{ t: "KHÔI PHỤC THÀNH CÔNG" }],
    [{ t: "NGÀY THỨ " }, { t: vn(TOTAL_DAYS), mono: true }],
    [{ t: `${digits} = ${DIGIT_SUM}`, mono: true }],
  ];

  // Cu phap "27 = C x C x C" chi dung khi tong chu so dung bang 27.
  // Doi ngay su kien -> tong khac -> bo ba dong nay thay vi noi sai.
  if (DIGIT_SUM === 27) {
    lines.push(
      [
        { t: "27 = 3", mono: true },
        { t: " × " },
        { t: "3", mono: true },
        { t: " × " },
        { t: "3", mono: true },
      ],
      [{ t: "C là chữ cái thứ " }, { t: "3", mono: true }],
      [{ t: "27", mono: true }, { t: " = C × C × C" }],
    );
  }
  return lines;
}

const LINES = buildLines();

const FINAL_LINE = "CHÚC MỪNG SINH NHẬT 18 TUỔI, YCC";
const YCC = [
  "var(--color-ycc-yellow)",
  "var(--color-ycc-red)",
  "var(--color-ycc-green)",
  "var(--color-ycc-blue)",
];

export default function Reveal({
  size = "phone",
  bg = "bg-void",
}: {
  size?: "phone" | "host";
  bg?: string;
}) {
  const total = LINES.length + 1;
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = setTimeout(() => setShown(total), 0);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= total) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [total]);

  const body = size === "host" ? "text-4xl md:text-6xl" : "text-lg";
  const mono = size === "host" ? "text-3xl md:text-5xl" : "text-base";
  const finalSize = size === "host" ? "text-5xl md:text-7xl" : "text-2xl";
  const gap = size === "host" ? "gap-8" : "gap-5";
  const done = shown > LINES.length;

  return (
    <div
      className={`relative z-10 flex min-h-dvh flex-col items-center justify-center ${gap} ${bg} px-6 text-center`}
    >
      {LINES.map((segs, i) => (
        <p
          key={i}
          className={`${body} font-semibold transition-all duration-500 ease-out ${
            i < shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {segs.map((s, j) =>
            s.mono ? (
              <span key={j} className={`font-display ${mono} align-middle`}>
                {s.t}
              </span>
            ) : (
              <span key={j}>{s.t}</span>
            ),
          )}
        </p>
      ))}

      {/* Quan sat vien doi mu sinh nhat — chi xuat hien o dung khoanh khac nay */}
      <div
        className={`transition-all duration-700 ease-out ${
          done ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <Image
          src="/mascot/mascot-birthday.png"
          alt=""
          width={size === "host" ? 260 : 130}
          height={size === "host" ? 260 : 130}
          priority
        />
      </div>

      <p
        className={`${finalSize} font-bold tracking-tight transition-all duration-500 ease-out ${
          done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {Array.from(FINAL_LINE).map((ch, i) => (
          <span key={i} style={{ color: YCC[i % 4] }}>
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}
