"use client";

import Link from "next/link";
import { SLOTS, TEAM_LABEL } from "@/data/game";

/**
 * Ban in 20 manh de bo phong bi.
 *
 * README hua co "Phu luc A" ban giay nhung tai lieu do khong ton tai trong repo —
 * day la ban thay the. Wifi chet giua chung thi 20 phong bi van chay duoc.
 *
 * In: A4 doc, 2 the moi hang, cat theo duong dut.
 */
export default function InPage() {
  return (
    <main className="in-page min-h-dvh bg-white px-8 py-10 text-black">
      <header className="mx-auto max-w-5xl print:hidden">
        <h1 className="text-2xl font-bold">Bản in {SLOTS.length} mảnh</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Bấm In → A4 dọc → cắt theo đường đứt → bỏ vào phong bì đúng mã. Mã in ở cả góc thẻ và
          mặt ngoài phong bì.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            className="border-2 border-black px-5 py-3 text-sm font-semibold"
            onClick={() => window.print()}
          >
            In
          </button>
          <Link href="/chia" className="border-2 border-neutral-300 px-5 py-3 text-sm">
            ← Chia tổ
          </Link>
        </div>
      </header>

      <div className="in-grid mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 print:mt-0">
        {SLOTS.map((s) => (
          <article key={s.id} className="in-card">
            <div className="flex items-baseline justify-between border-b-2 border-black pb-2">
              <span className="font-display text-lg">{s.id}</span>
              <span className="text-[10px] tracking-widest uppercase">{TEAM_LABEL[s.team]}</span>
            </div>

            <div className="flex flex-1 flex-col gap-3 pt-3">
              {s.diary && (
                <div>
                  <p className="text-[10px] leading-snug font-bold tracking-wide">
                    {s.diary.header}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed">“{s.diary.body}”</p>
                </div>
              )}

              {s.memory && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase">Hai năm trong trí nhớ</p>
                  <p className="font-display mt-1 text-base">{s.memory}</p>
                </div>
              )}

              <div className="mt-auto border-t border-dashed border-neutral-400 pt-2">
                <p className="text-[10px] tracking-widest uppercase">Ghi chép rời</p>
                <p className="mt-1 text-[13px] leading-relaxed">“{s.note}”</p>
              </div>
            </div>

            <p className="mt-3 border-t border-neutral-300 pt-2 text-[9px] text-neutral-500">
              Quét mã trên máy chiếu → nhập <span className="font-display">{s.id}</span>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
