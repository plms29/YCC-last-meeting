"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import { SLOTS, TEAM_LABEL, type Team } from "@/data/game";

const TEAMS: Team[] = ["Y", "C1", "C2"];
const CODES_OF: Record<Team, string[]> = {
  Y: SLOTS.filter((s) => s.team === "Y").map((s) => s.id),
  C1: SLOTS.filter((s) => s.team === "C1").map((s) => s.id),
  C2: SLOTS.filter((s) => s.team === "C2").map((s) => s.id),
};
const CODES = TEAMS.flatMap((t) => CODES_OF[t]); // 20 mã, đúng thứ tự tổ
const SIZE = (t: Team) => CODES_OF[t].length;

const STORE = "ycc:teams";

type Person = { name: string; team: Team; codes: string[] };
type Result = { byCode: Record<string, string[]>; byPerson: Person[] };

/** Fisher-Yates. Chỉ chạy khi MC bấm nút nên dùng Math.random là đủ. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Chia n người vào 3 tổ theo đúng tỉ lệ số mã của tổ đó (7 : 7 : 6),
 * dùng largest-remainder nên không tổ nào bị phình.
 * Mỗi tổ luôn phải có ít nhất một người — tổ trống là một lớp khoá không ai mở.
 */
function splitCounts(n: number): Record<Team, number> {
  const raw = TEAMS.map((t) => (n * SIZE(t)) / CODES.length);
  const base = raw.map((v) => Math.floor(v));
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  let rem = n - base.reduce((a, b) => a + b, 0);
  let k = 0;
  while (rem > 0) {
    base[order[k % TEAMS.length].i]++;
    rem--;
    k++;
  }

  const out = { Y: base[0], C1: base[1], C2: base[2] } as Record<Team, number>;
  for (const t of TEAMS) {
    if (out[t] > 0) continue;
    const donor = TEAMS.reduce((a, b) => (out[a] >= out[b] ? a : b));
    if (out[donor] > 1) {
      out[donor]--;
      out[t]++;
    }
  }
  return out;
}

/**
 * Cả 20 mảnh luôn phải có người cầm — thiếu một mảnh là hỏng cả một lớp khoá.
 *
 * Ít hơn 20 người  -> có người giữ 2 phong bì, và cả hai mã đó LUÔN cùng một tổ
 *                     (nếu không, người đó phải ngồi hai chỗ cùng lúc).
 * Nhiều hơn 20     -> có phong bì 2 người chung, rải đều 3 tổ chứ không dồn vào Y.
 */
function assign(names: string[]): Result {
  const people = shuffle(names);
  const counts = splitCounts(people.length);
  const byCode: Record<string, string[]> = Object.fromEntries(CODES.map((c) => [c, []]));
  const byPerson: Person[] = [];

  let cursor = 0;
  for (const team of TEAMS) {
    const members = people.slice(cursor, cursor + counts[team]);
    cursor += counts[team];
    if (members.length === 0) continue;

    const codes = CODES_OF[team];
    // Khoa theo chi so chu khong theo ten — hai nguoi trung ten van tach bach
    const per: string[][] = members.map(() => []);

    if (members.length >= codes.length) {
      members.forEach((name, i) => {
        const code = codes[i % codes.length];
        byCode[code].push(name);
        per[i].push(code);
      });
    } else {
      codes.forEach((code, i) => {
        const mi = i % members.length;
        byCode[code].push(members[mi]);
        per[mi].push(code);
      });
    }

    members.forEach((name, i) => byPerson.push({ name, team, codes: per[i] }));
  }

  return { byCode, byPerson };
}

export default function ChiaPage() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loaded, setLoaded] = useState(false);

  const names = raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORE);
      if (s) {
        const p = JSON.parse(s) as { raw: string; result: Result };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage chỉ đọc được sau khi mount
        setRaw(p.raw ?? "");
        // Ban cu chi luu byCode — bo qua thay vi ve ra bang hong
        if (p.result?.byPerson) setResult(p.result);
      }
    } catch {
      /* localStorage bị chặn -> chia lại từ đầu, không sao */
    }
    setLoaded(true);
  }, []);

  function divide() {
    const r = assign(names);
    setResult(r);
    try {
      localStorage.setItem(STORE, JSON.stringify({ raw, result: r }));
    } catch {
      /* bỏ qua */
    }
  }

  function clear() {
    setResult(null);
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* bỏ qua */
    }
  }

  const extra = names.length - CODES.length;
  const doubles = result?.byPerson.filter((p) => p.codes.length > 1) ?? [];
  const shared = result ? CODES.filter((c) => (result.byCode[c]?.length ?? 0) > 1) : [];

  return (
    <main className="bg-void relative min-h-dvh">
      <Starfield />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="print:hidden">
          <p className="font-display text-signal text-[10px]">CHIA TO</p>
          <h1 className="text-helmet mt-3 text-2xl font-bold">
            Chia người thành 3 tổ · {CODES.length} mã phong bì
          </h1>
          <p className="text-dust mt-2 text-sm">
            Phút 48–53. Chia xong thì phát phong bì theo đúng mã bên dưới.
          </p>
        </header>

        {/* nhập tên */}
        <section className="flex flex-col gap-3 print:hidden">
          <label htmlFor="names" className="text-dust text-xs tracking-widest uppercase">
            Danh sách tên — mỗi dòng một người
          </label>
          <textarea
            id="names"
            className="px-input min-h-40 w-full p-4 text-[15px] leading-relaxed"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={"Minh\nAn\nHà\n…"}
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="px-btn border-signal text-signal px-5 py-3 font-semibold"
              onClick={divide}
              disabled={names.length < 3}
            >
              {result ? "Chia lại" : "Chia tổ"}
            </button>
            {result && (
              <button className="px-btn px-5 py-3" onClick={clear}>
                Xoá
              </button>
            )}
            <button className="px-btn px-5 py-3" onClick={() => window.print()}>
              In
            </button>
            <span className="text-dust text-sm">
              <span className="font-display">{names.length}</span> người
              {names.length > 0 && names.length < 3 && (
                <span className="text-alarm"> · cần ít nhất 3 người cho 3 tổ</span>
              )}
              {extra > 0 && (
                <span className="text-alarm">
                  {" "}
                  · dư <span className="font-display">{extra}</span>, sẽ có phong bì 2 người chung
                </span>
              )}
              {extra < 0 && (
                <span className="text-alarm">
                  {" "}
                  · thiếu <span className="font-display">{-extra}</span> so với {CODES.length} mảnh,
                  sẽ có người giữ 2 phong bì
                </span>
              )}
            </span>
          </div>
        </section>

        {/* cảnh báo sau khi chia */}
        {result && (doubles.length > 0 || shared.length > 0) && (
          <section className="fragment p-4">
            <p className="text-signal text-[11px] tracking-widest uppercase">Cần để ý khi phát</p>
            {doubles.length > 0 && (
              <p className="text-helmet mt-2 text-sm leading-relaxed">
                <span className="font-display">{doubles.length}</span> người giữ 2 phong bì. Cả hai
                mã của họ đều nằm trong cùng một tổ nên không ai phải ngồi hai chỗ:{" "}
                {doubles.map((p, i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <span className="font-semibold">{p.name}</span>{" "}
                    <span className="font-display text-signal text-xs">
                      ({p.codes.join(" + ")})
                    </span>
                  </span>
                ))}
              </p>
            )}
            {shared.length > 0 && (
              <p className="text-helmet mt-2 text-sm leading-relaxed">
                <span className="font-display">{shared.length}</span> phong bì có 2 người chung:{" "}
                <span className="font-display text-signal text-xs">{shared.join(", ")}</span>
              </p>
            )}
          </section>
        )}

        {/* kết quả theo mã — dùng lúc soạn phong bì */}
        {loaded && (
          <section className="grid gap-5 md:grid-cols-3">
            {TEAMS.map((team) => (
              <article key={team} className="fragment flex flex-col">
                <div className="fragment-noise">▓▒░ HO SO {team} ░▒▓</div>
                <div className="flex items-baseline justify-between px-4 pt-4">
                  <h2 className="text-signal text-sm font-semibold tracking-widest uppercase">
                    {TEAM_LABEL[team]}
                  </h2>
                  <span className="font-display text-dust text-[10px]">
                    {result
                      ? `${result.byPerson.filter((p) => p.team === team).length} ng · ${SIZE(team)} mã`
                      : `${SIZE(team)} mã`}
                  </span>
                </div>
                <ul className="flex flex-col gap-2 p-4">
                  {CODES_OF[team].map((code) => {
                    const people = result?.byCode[code] ?? [];
                    return (
                      <li key={code} className="flex items-baseline gap-3">
                        <span className="font-display text-helmet w-14 shrink-0 text-[11px]">
                          {code}
                        </span>
                        <span
                          className={
                            people.length ? "text-helmet text-[15px]" : "text-dust text-sm italic"
                          }
                        >
                          {people.length ? people.join("  +  ") : "chưa có người"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </section>
        )}

        {/* kết quả theo người — dùng lúc gọi tên và xếp chỗ ngồi */}
        {result && (
          <section className="flex flex-col gap-3">
            <h2 className="text-dust text-xs tracking-widest uppercase">
              Theo người — ai ngồi tổ nào, cầm mã nào
            </h2>
            <div className="fragment overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-suit border-b-2">
                    {["Tên", "Ngồi tổ", "Phong bì"].map((h) => (
                      <th
                        key={h}
                        className="text-signal px-3 py-3 text-[11px] tracking-widest uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.byPerson.map((p, i) => (
                    <tr key={i} className="border-suit/40 border-b">
                      <td className="text-helmet px-3 py-2 font-semibold">{p.name}</td>
                      <td className="text-dust px-3 py-2">{TEAM_LABEL[p.team]}</td>
                      <td className="font-display text-signal px-3 py-2 text-[11px]">
                        {p.codes.join("  +  ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="text-dust text-[11px] leading-relaxed print:hidden">
          Kết quả lưu trên máy này, mở lại vẫn còn. Không tổ nào giữ đủ mảnh của chính mình — đó
          là chủ ý, các tổ buộc phải đi hỏi nhau.
        </p>

        <div className="flex gap-5 print:hidden">
          <Link href="/mc" className="text-dust text-xs underline">
            ← Bảng đáp án MC
          </Link>
          <Link href="/in" className="text-dust text-xs underline">
            In 20 mảnh để bỏ phong bì →
          </Link>
        </div>
      </div>
    </main>
  );
}
