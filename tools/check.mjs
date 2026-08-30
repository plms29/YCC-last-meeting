/**
 * Tu kiem tra toan bo con so cua tro choi. Khong can cai them gi:
 *   node tools/check.mjs
 *
 * Chay lai script nay moi khi doi DAY0 / EVENT trong ycc-6597/data/event.ts.
 * No khong doc file TypeScript — no tinh lai doc lap tu hai moc ngay,
 * roi doi chieu voi nhung gi ban da khai bao ben duoi.
 */

// ── Hai moc ngay: phai khop voi data/event.ts ─────────────────
const DAY0 = { y: 2008, m: 8, d: 7 };
const EVENT = { y: 2026, m: 8, d: 30 };

// ── Nhung gi phan con lai cua app dang gia dinh ───────────────
const MONG_DOI = {
  finalCode: "6597",
  answerY: 6570,
  answerC1: 4,
  answerC2: 23,
  rounds: 18,
  leapYears: [2012, 2016, 2020, 2024],
  eventWeekday: 0, // 0 = Chu nhat — manh C2-4 khang dinh dieu nay
  quocKhanhGap: 26, // manh C2-2: tu ngay 0 den 02/09 dung 26 ngay
  tuoi: 18, // dong cuoi man reveal
};

// Danh sach nam trong luoi chon cua to C1 (data/game.ts · C1_YEARS)
const C1_YEARS = [
  2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2018, 2020, 2022, 2024, 2025,
];

const DAY_MS = 86_400_000;
const utc = (x) => Date.UTC(x.y, x.m - 1, x.d);
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const totalDays = Math.round((utc(EVENT) - utc(DAY0)) / DAY_MS);
const rounds = EVENT.y - DAY0.y;
const daysPerRound = 52 * 7 + 1;
const answerY = rounds * daysPerRound;

const leapYears = [];
for (let y = DAY0.y; y <= EVENT.y; y++) {
  if (!isLeap(y)) continue;
  const feb29 = Date.UTC(y, 1, 29);
  if (feb29 > utc(DAY0) && feb29 <= utc(EVENT)) leapYears.push(y);
}
const answerC1 = leapYears.length;
const answerC2 = totalDays - answerY - answerC1;

const quocKhanh = Date.UTC(DAY0.y, 8, 2); // 02/09 cung nam
const quocKhanhGap = Math.round((quocKhanh - utc(DAY0)) / DAY_MS);

const digitSum = [...String(totalDays)].reduce((a, c) => a + Number(c), 0);

let hong = 0;
const kiem = (ten, thuc, mong) => {
  const a = JSON.stringify(thuc);
  const b = JSON.stringify(mong);
  const ok = a === b;
  if (!ok) hong++;
  console.log(`${ok ? "  ok  " : "  SAI "} ${ten.padEnd(42)} ${a}${ok ? "" : `  (mong doi ${b})`}`);
};

console.log(`\nNgay 0 : ${DAY0.d}/${DAY0.m}/${DAY0.y}`);
console.log(`Su kien: ${EVENT.d}/${EVENT.m}/${EVENT.y}\n`);

kiem("ma khoi phuc cuoi", String(totalDays), MONG_DOI.finalCode);
kiem("dap so ho so Y", answerY, MONG_DOI.answerY);
kiem("dap so ho so C1", answerC1, MONG_DOI.answerC1);
kiem("dap so ho so C2", answerC2, MONG_DOI.answerC2);
kiem("so vong (gen)", rounds, MONG_DOI.rounds);
kiem("cac nam nhuan sau ngay 0", leapYears, MONG_DOI.leapYears);
kiem("Y + C1 + C2 = ma cuoi", answerY + answerC1 + answerC2, totalDays);

// Bay: 29/02/2008 nam TRUOC ngay 0 nen phai bi loai
kiem("nam thanh lap bi loai khoi C1", leapYears.includes(DAY0.y), false);

// Manh C2-4 noi "hom nay la Chu nhat cuoi cung cua thang"
const thu = new Date(utc(EVENT)).getUTCDay();
kiem("ngay su kien la Chu nhat", thu, MONG_DOI.eventWeekday);
const sauMotTuan = new Date(utc(EVENT) + 7 * DAY_MS);
kiem("… va la Chu nhat cuoi thang", sauMotTuan.getUTCMonth() !== EVENT.m - 1, true);

// Manh C2-2 va C2-3
kiem("khoang cach toi Quoc khanh", quocKhanhGap, MONG_DOI.quocKhanhGap);
kiem("ngay trong thang = so ngay mot tuan", DAY0.d, 7);
kiem("thang 0 dung truoc thang Quoc khanh", DAY0.m, 8);

// Luoi chon nam cua to C1 phai chua du dap an
kiem(
  "luoi C1_YEARS chua du cac nam dung",
  leapYears.every((y) => C1_YEARS.includes(y)),
  true,
);
kiem("luoi C1_YEARS co chua bay 2008", C1_YEARS.includes(DAY0.y), true);

// Man reveal: 6+5+9+7 = 27 = 3x3x3, C la chu cai thu 3
kiem("tong chu so ma cuoi = 27 (man reveal)", digitSum, 27);
kiem("tuoi CLB khop dong cuoi reveal", EVENT.y - DAY0.y, MONG_DOI.tuoi);

if (hong > 0) {
  console.log(`\n${hong} cho khong khop. Sua data/event.ts hoac sua lai text truoc khi chay that.\n`);
  process.exit(1);
}
console.log("\nTat ca khop. An tam chay that.\n");
