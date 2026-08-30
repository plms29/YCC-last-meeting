"use client";

import { useEffect, useState } from "react";

/**
 * Hien tung dong mot, moi dong cach nhau `stepMs`.
 * Dung state + transition (khong dung animation-delay) de chac chan chay
 * tren moi trinh duyet may chieu. prefers-reduced-motion -> hien thang.
 */
export default function LineSequence({
  lines,
  stepMs = 1400,
  className = "",
  lineClassName = "",
}: {
  lines: string[];
  stepMs?: number;
  className?: string;
  lineClassName?: string;
}) {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = setTimeout(() => setShown(lines.length), 0);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= lines.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [lines.length, stepMs]);

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p
          key={i}
          className={`${lineClassName} transition-all duration-500 ease-out ${
            i < shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
