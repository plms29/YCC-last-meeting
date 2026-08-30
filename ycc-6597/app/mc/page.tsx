import type { Metadata } from "next";
import Link from "next/link";
import {
  ANSWER_C1,
  ANSWER_C2,
  ANSWER_Y,
  DAY0,
  DAYS_PER_ROUND,
  EVENT,
  FINAL_CODE,
  LEAP_YEARS,
  ROUNDS,
  dd,
} from "@/data/event";

export const metadata: Metadata = {
  title: "MC · Bảng đáp án",
  robots: { index: false, follow: false, nocache: true },
};

const ANSWERS: [string, string, string, string][] = [
  [
    "Y",
    "1",
    String(ROUNDS),
    `Poster GEN ${ROUNDS} trên tường là manh mối. Mảnh giả Y6 ghi ${ROUNDS + 1}.`,
  ],
  ["Y", "2", String(DAYS_PER_ROUND), `52 × 7 = ${52 * 7}, thừa 1 ngày`],
  ["Y", "3", String(ANSWER_Y), `${ROUNDS} × ${DAYS_PER_ROUND}`],
  ["C₁", "1", "29/02", "—"],
  [
    "C₁",
    "2",
    LEAP_YEARS.join(", "),
    `LOẠI ${DAY0.y} — 29/02/${DAY0.y} trước ngày thành lập`,
  ],
  [
    "C₁",
    "3",
    String(ANSWER_C1),
    `Nếu tổ báo ${ANSWER_C1 + 1} thì nhắc câu gợi ý, không cho đáp án`,
  ],
  ["C₂", "1", dd(DAY0), "—"],
  ["C₂", "2", `${dd(EVENT)}/${EVENT.y} (chủ nhật)`, "Phải tự đi tìm trong phòng"],
  ["C₂", "3", String(ANSWER_C2), "—"],
  ["CHUNG", "—", FINAL_CODE, `${ANSWER_Y} + ${ANSWER_C1} + ${ANSWER_C2}`],
];

const HINTS: [string, string][] = [
  [`Y không ra ${ROUNDS}`, "Câu trả lời không nằm trong phong bì. Nó đang treo trên tường."],
  [`Y không ra ${DAYS_PER_ROUND}`, "Các ngươi có 52 và có 7. Nhân đi."],
  [
    `C₁ ra ${ANSWER_C1 + 1} thay vì ${ANSWER_C1}`,
    "Ngươi đang tính cả ngày ta còn chưa ra đời.",
  ],
  ["C₁ không biết bắt đầu", "Đọc lại mảnh nói về nửa đầu năm."],
  [`C₂ không ra ${dd(DAY0)}`, "Quốc khánh là ngày nào? Lùi lại 26 ngày."],
  ["C₂ không biết hôm nay", "Đứng dậy. Câu trả lời không có trong giấy."],
];

/** Bốn cách sai hay gặp nhất — tra ngược từ con số tổ đọc lên để biết họ hỏng ở đâu. */
const ERRORS: [string, string][] = [
  [
    String(ANSWER_Y + ANSWER_C1 + ANSWER_C2 + 1),
    `Đếm ${ANSWER_C2 + 1} thay vì ${ANSWER_C2} ngày`,
  ],
  [
    String((ROUNDS + 1) * DAYS_PER_ROUND + ANSWER_C1 + ANSWER_C2),
    `Dùng mảnh giả Y6, lấy ${ROUNDS + 1} vòng`,
  ],
  [
    String(ANSWER_Y + (ANSWER_C1 + 1) + ANSWER_C2),
    `Lấy ${ANSWER_C1 + 1} năm nhuận (tính cả ${DAY0.y})`,
  ],
  [String(ANSWER_Y + ANSWER_C1), `Quên cộng ${ANSWER_C2}`],
];

export default function McPage() {
  return (
    <main className="bg-void min-h-dvh px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header>
          <p className="font-display text-alarm text-[10px]">MC ONLY</p>
          <h1 className="text-helmet mt-3 text-2xl font-bold">Bảng đáp án · MÃ {FINAL_CODE}</h1>
          <p className="text-dust mt-2 text-sm">Không để lọt trang này ra ngoài.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/chia"
              className="px-btn border-signal text-signal inline-block px-4 py-3 text-sm font-semibold"
            >
              Chia tổ Y / C₁ / C₂ →
            </Link>
            <Link href="/in" className="px-btn inline-block px-4 py-3 text-sm font-semibold">
              In 20 mảnh →
            </Link>
          </div>
        </header>

        <Table
          caption="Đáp án từng lớp"
          head={["Hồ sơ", "Lớp", "Đáp án", "Ghi chú"]}
          rows={ANSWERS}
        />
        <Table caption="Gợi ý khi tổ bị kẹt" head={["Tổ kẹt ở", "Câu MC đọc"]} rows={HINTS} />
        <Table caption="Bảng sai số" head={["Kết quả", "Nguyên nhân"]} rows={ERRORS} />

        <section className="fragment p-5">
          <p className="font-display text-signal text-[10px]">PHUT CHOT</p>
          <p className="text-helmet mt-3 text-[15px] leading-relaxed">
            “Ba con số. Ta chỉ biết cộng. Cả phòng — đếm ngược cùng tôi. Ba... hai... một...”
          </p>
          <p className="text-dust mt-3 text-sm">
            Cả phòng hô → Reveal (slide 5) → tắt đèn → bánh vào.
          </p>
        </section>
      </div>
    </main>
  );
}

function Table({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-dust text-xs tracking-widest uppercase">{caption}</h2>
      <div className="fragment overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-suit border-b-2">
              {head.map((h) => (
                <th key={h} className="text-signal px-3 py-3 text-[11px] tracking-widest uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-suit/40 border-b">
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`px-3 py-3 ${j === 0 ? "text-helmet font-semibold" : "text-dust"}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
