/**
 * Nguồn sự thật duy nhất cho mọi con số của trò chơi.
 *
 * Đổi hai mốc ngày bên dưới là toàn bộ đáp án từng lớp, mã khôi phục cuối,
 * và chữ hiển thị trên máy chiếu tự đổi theo. Không còn chỗ nào hardcode 6597.
 *
 * Chạy `node tools/check.mjs` để kiểm tra lại toàn bộ phép tính.
 */

export type Ngay = { y: number; m: number; d: number };

/** Ngày Quan sát viên "mở mắt" — ngày thành lập CLB. */
export const DAY0: Ngay = { y: 2008, m: 8, d: 7 };

/** Ngày diễn ra buổi sinh hoạt. */
export const EVENT: Ngay = { y: 2026, m: 8, d: 30 };

const DAY_MS = 86_400_000;
const utc = (x: Ngay) => Date.UTC(x.y, x.m - 1, x.d);

/** Tổng số ngày Quan sát viên đã ghi chép — chính là mã khôi phục. */
export const TOTAL_DAYS = Math.round((utc(EVENT) - utc(DAY0)) / DAY_MS);

/** Số "vòng" (gen) đã trôi qua. */
export const ROUNDS = EVENT.y - DAY0.y;

/** Một vòng theo cách đếm của Quan sát viên: 52 tuần × 7 ngày, thừa 1 ngày lạc lõng. */
export const DAYS_PER_ROUND = 52 * 7 + 1;

/** Đáp số hồ sơ Y. */
export const ANSWER_Y = ROUNDS * DAYS_PER_ROUND;

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/**
 * Những năm 29/02 thực sự ghé qua SAU ngày 0.
 * 2008 bị loại vì 29/02/2008 nằm trước 07/08/2008 — đây là cái bẫy của tổ C₁.
 */
export const LEAP_YEARS: number[] = (() => {
  const out: number[] = [];
  for (let y = DAY0.y; y <= EVENT.y; y++) {
    if (!isLeap(y)) continue;
    const feb29 = Date.UTC(y, 1, 29);
    if (feb29 > utc(DAY0) && feb29 <= utc(EVENT)) out.push(y);
  }
  return out;
})();

/** Đáp số hồ sơ C₁ — số ngày 29/02 đã ghé qua. */
export const ANSWER_C1 = LEAP_YEARS.length;

/** Đáp số hồ sơ C₂ — phần còn lại, chính là số ngày từ 07/08 tới 30/08. */
export const ANSWER_C2 = TOTAL_DAYS - ANSWER_Y - ANSWER_C1;

/** Mã khôi phục bốn chữ số. */
export const FINAL_CODE = String(TOTAL_DAYS);

/** Tổng các chữ số của mã cuối — màn reveal dựa vào con số này. */
export const DIGIT_SUM = [...FINAL_CODE].reduce((a, c) => a + Number(c), 0);

/** 6597 → "6.597". Tự cài đặt thay vì toLocaleString để SSR và client ra y hệt nhau. */
export function vn(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** {d:7,m:8} → "07/08" */
export function dd(x: Pick<Ngay, 'd' | 'm'>): string {
  return `${String(x.d).padStart(2, '0')}/${String(x.m).padStart(2, '0')}`;
}

/**
 * Mọi kiểu gõ ngày mà người chơi có thể nhập.
 * normalize() bỏ dấu "/" nên "07/08" và "0708" về cùng một chuỗi — vẫn liệt kê
 * đủ biến thể cho dễ đọc khi ai đó mở file này ra sửa.
 */
export function dateAccepts(x: Pick<Ngay, 'd' | 'm'>, year?: number): string[] {
  const D = String(x.d).padStart(2, '0');
  const M = String(x.m).padStart(2, '0');
  const out = [`${D}/${M}`, `${x.d}/${x.m}`, `${D}/${x.m}`, `${x.d}/${M}`];
  if (year) out.push(`${D}/${M}/${year}`, `${x.d}/${x.m}/${year}`);
  return out;
}
