"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import {
  C1_YEARS,
  LAYERS,
  TEAM_LABEL,
  normalize,
  type Layer,
  type Slot,
} from "@/data/game";

type Progress = { solved: number; answers: string[] };

const EMPTY: Progress = { solved: 0, answers: [] };

export default function PlayClient({ slot }: { slot: Slot }) {
  const layers = LAYERS[slot.team];
  const key = `ycc:progress:${slot.team}`;
  const [prog, setProg] = useState<Progress>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const p = JSON.parse(raw) as Progress;
        if (typeof p?.solved === "number") {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage chi doc duoc sau khi mount
          setProg({ solved: p.solved, answers: p.answers ?? [] });
        }
      }
    } catch {
      /* localStorage bi chan -> choi lai tu dau, khong sao */
    }
    setLoaded(true);
  }, [key]);

  function solve(index: number, answer: string) {
    const next: Progress = {
      solved: Math.max(prog.solved, index + 1),
      answers: (() => {
        const a = [...prog.answers];
        a[index] = answer;
        return a;
      })(),
    };
    setProg(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* bo qua */
    }
  }

  const done = prog.solved >= layers.length;

  return (
    <main className="bg-void relative min-h-dvh">
      <Starfield />
      <div className="relative z-10 mx-auto flex max-w-md flex-col gap-8 px-5 py-8">
        {/* header */}
        <header className="flex items-center gap-3">
          <Image src="/mascot/astronaut-small.png" alt="" width={44} height={44} />
          <div>
            <p className="font-display text-signal text-[10px]">{slot.id}</p>
            <p className="text-dust mt-1 text-xs">{TEAM_LABEL[slot.team]}</p>
          </div>
        </header>

        {/* 1. Manh cua nguoi */}
        <section className="flex flex-col gap-3">
          <h2 className="text-dust text-xs tracking-widest uppercase">Mảnh của ngươi</h2>
          <article className="fragment">
            <div className="fragment-noise">▓▒░ FRAGMENT {slot.id} ░▒▓</div>
            <div className="flex flex-col gap-4 p-4">
              {slot.diary && (
                <div>
                  <p className="text-signal text-[11px] leading-relaxed font-semibold">
                    {slot.diary.header}
                  </p>
                  <p className="text-helmet mt-2 text-[15px] leading-relaxed">
                    “{slot.diary.body}”
                  </p>
                </div>
              )}
              {slot.memory && (
                <div>
                  <p className="text-signal text-[11px] tracking-widest uppercase">
                    Hai năm trong trí nhớ
                  </p>
                  <p className="text-helmet mt-2 text-lg">
                    {slot.memory.split(" · ").map((y, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-dust">  ·  </span>}
                        <span className="font-display">{y}</span>
                      </span>
                    ))}
                  </p>
                </div>
              )}
              <div className="border-suit border-t-2 pt-3">
                <p className="text-dust text-[11px] tracking-widest uppercase">Ghi chép rời</p>
                <p className="text-helmet mt-2 text-[15px] leading-relaxed">“{slot.note}”</p>
              </div>
            </div>
          </article>
        </section>

        {/* 2. Ba lop khoa cua to */}
        <section className="flex flex-col gap-4">
          <h2 className="text-dust text-xs tracking-widest uppercase">
            Ba lớp khoá của {TEAM_LABEL[slot.team]}
          </h2>
          {loaded &&
            layers.map((layer, i) => (
              <LayerBox
                key={layer.n}
                layer={layer}
                state={i < prog.solved ? "solved" : i === prog.solved ? "open" : "locked"}
                savedAnswer={prog.answers[i]}
                onSolve={(a) => solve(i, a)}
              />
            ))}
        </section>

        {/* 3. Sang /final */}
        {done && (
          <Link
            href="/final"
            className="px-btn border-signal text-signal block px-4 py-4 text-center font-semibold"
          >
            Ba con số đã đủ → nhập mã cuối
          </Link>
        )}

        <div className="flex flex-col gap-3 pb-6">
          <p className="text-dust text-[11px] leading-relaxed">
            Tiến độ chỉ lưu trên máy này. Cả tổ tụ lại quanh một điện thoại mà nhập.
          </p>
          {/* Nguoi giu 2 phong bi can quay lai /join ma khong bi tu dong day ve day */}
          <Link
            href="/join?doi=1"
            className="text-dust self-start text-xs underline underline-offset-4"
          >
            Ngươi giữ phong bì thứ hai? → đổi mã
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */

/** Press Start 2P chi co glyph ASCII — chuoi co dau phai dung Be Vietnam Pro. */
function pixelSafe(s: string): boolean {
  return /^[ -~]*$/.test(s);
}

function LayerTitle({ layer, tone }: { layer: Layer; tone: string }) {
  const name = layer.title.replace(/^LỚP\s*\d+\s*—\s*/, "");
  return (
    <p className={`flex items-center gap-3 ${tone}`}>
      <span className="font-display text-[11px]">0{layer.n}</span>
      <span className="text-[11px] font-semibold tracking-widest uppercase">
        {name}
      </span>
    </p>
  );
}

function LayerBox({
  layer,
  state,
  savedAnswer,
  onSolve,
}: {
  layer: Layer;
  state: "locked" | "open" | "solved";
  savedAnswer?: string;
  onSolve: (answer: string) => void;
}) {
  const [text, setText] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);

  if (state === "locked") {
    return (
      <article className="fragment opacity-50">
        <div className="p-4">
          <LayerTitle layer={layer} tone="text-dust" />
          <p className="text-dust mt-3 text-sm leading-relaxed">
            Lớp trước chưa xong. Ta không nói chuyện với kẻ đi tắt.
          </p>
        </div>
      </article>
    );
  }

  if (state === "solved") {
    return (
      <article className="fragment border-signal">
        <div className="p-4">
          <LayerTitle layer={layer} tone="text-signal" />
          <p className="text-helmet mt-3 text-lg break-words">
            {(savedAnswer ?? "—").split(" · ").map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-dust"> · </span>}
                <span className={pixelSafe(part) ? "font-display" : "font-semibold"}>{part}</span>
              </span>
            ))}
          </p>
          <p className="text-signal mt-2 text-sm leading-relaxed">{layer.onCorrect}</p>
        </div>
      </article>
    );
  }

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (layer.kind === "years") {
      const want = [...(layer.acceptYears ?? [])].sort();
      const got = [...years].sort();
      const ok = want.length === got.length && want.every((y, i) => y === got[i]);
      if (ok) onSolve(got.join(" · "));
      else fail();
      return;
    }
    const n = normalize(text);
    if (n && layer.accept.some((a) => normalize(a) === n)) onSolve(text.trim());
    else fail();
  }

  function fail() {
    setWrong(true);
    setTimeout(() => setWrong(false), 700);
  }

  return (
    <article className={`fragment ${wrong ? "shake border-alarm" : ""}`}>
      <div className="flex flex-col gap-3 p-4">
        <LayerTitle layer={layer} tone="text-helmet" />
        <p className="text-helmet text-[15px] leading-relaxed">{layer.prompt}</p>

        {layer.kind === "years" ? (
          <form onSubmit={check} className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-2">
              {C1_YEARS.map((y) => {
                const on = years.includes(y);
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() =>
                      setYears((prev) => (on ? prev.filter((v) => v !== y) : [...prev, y]))
                    }
                    className={`px-btn font-display py-3 text-[11px] ${
                      on ? "border-signal text-signal bg-suit/25" : "text-dust"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
            <button type="submit" className="px-btn px-4 py-3 font-semibold">
              Nộp
            </button>
          </form>
        ) : (
          <form onSubmit={check} className="flex gap-2">
            <input
              className="px-input min-w-0 flex-1 px-3 py-3 text-center text-lg"
              value={text}
              onChange={(e) => setText(e.target.value)}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="submit" className="px-btn px-5 py-3 font-semibold">
              Nhập
            </button>
          </form>
        )}

        {wrong && <p className="text-alarm text-sm">Sai. Ta không nhớ con số đó.</p>}
      </div>
    </article>
  );
}
