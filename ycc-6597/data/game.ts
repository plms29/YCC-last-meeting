import {
  ANSWER_C1,
  ANSWER_C2,
  ANSWER_Y,
  DAY0,
  DAYS_PER_ROUND,
  EVENT,
  LEAP_YEARS,
  ROUNDS,
  dateAccepts,
} from './event';

export type Team = 'Y' | 'C1' | 'C2';

export type Slot = {
  id: string;
  team: Team;
  diary?: { header: string; body: string };  // trang nhật ký (chỉ tổ Y)
  memory?: string;                            // dòng "hai năm trong trí nhớ" (chỉ tổ C1)
  note: string;                               // ghi chép rời — mọi slot đều có
};

/**
 * Ba trang nhật ký của Y2 (2014), Y3 (2021) và Y5 (2019) đang dùng lời trung tính —
 * chúng không khẳng định sự kiện có thật nào của CLB, chỉ tả cảnh nhìn từ quỹ đạo.
 * Thay bằng sự kiện thật của từng năm sẽ hay hơn nhiều, nhưng để nguyên vẫn chơi được.
 * Đổi xong nhớ in lại /in trước khi soạn phong bì.
 */
export const SLOTS: Slot[] = [
  // ───────── HỒ SƠ Y ─────────
  {
    id: 'Y1', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 1 · NĂM 2008',
      body: 'Ngày 0. Ta mở mắt. Dưới kia có một nhóm người và một cái tên chưa ai đọc cho đúng.',
    },
    note: 'Mỗi vòng, ta đếm được 52 lần ngày-nghỉ-đôi.',
  },
  {
    id: 'Y2', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 7 · NĂM 2014',
      body: 'Đêm ấy dưới kia sáng đèn lâu hơn thường lệ. Chúng nó dựng một thứ gì đó, phá đi, rồi dựng lại. Ta đếm ba lần.',
    },
    note: 'Mã khôi phục của phần này là: số vòng hiện tại nhân với số ngày của một vòng.',
  },
  {
    id: 'Y3', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 14 · NĂM 2021',
      body: 'Vòng này dưới kia vắng. Chúng nó không tụ lại một chỗ nữa mà nói với nhau qua những ô sáng nhỏ. Ta vẫn ghi đủ, dù chẳng có mấy thứ để ghi.',
    },
    note: 'Mỗi lần ngày-nghỉ-đôi cách nhau đúng 7 ngày. Không xê dịch.',
  },
  {
    id: 'Y4', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 18 · NĂM 2025',
      body: 'Chúng nó gọi lứa này là GEN. Ta gọi là VÒNG. Cùng một thứ.',
    },
    note: 'Nhưng một vòng của Trái Đất không phải 364. Luôn thừa ra một ngày lạc lõng, không thuộc tuần nào.',
  },
  {
    id: 'Y5', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG ██ · NĂM 2019',
      body: 'Dưới kia chúng nó đứng thành vòng tròn và hát một bài ta không hiểu lời. Đêm đó không ai về sớm — số vòng ở góc trang đã mờ.',
    },
    note: 'Vòng thứ n bắt đầu vào năm 2007 + n. Ta chưa bao giờ ghi sai điều này. Và 52 × 7 = 364.',
  },
  {
    id: 'Y6', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 19 · NĂM 2025',
      body: 'Ca trực mới bắt đầu. YOUNG CREATION CLUP đã bước sang vòng thứ mười chín.',
    },
    note: 'Hãy dùng số vòng ghi trên trang này. Đừng tin poster ngoài kia.',
  },
  {
    id: 'Y7', team: 'Y',
    diary: {
      header: 'TRANG NHẬT KÝ · VÒNG 18 · NĂM 2025',
      body: 'Poster chúng nó treo ngoài kia có ghi số vòng hiện tại. Đi mà nhìn.',
    },
    note: 'Ta chỉ biết ghi. Ta không biết bịa. Nếu có hai trang cùng một năm mà số vòng khác nhau — thì một trang trong đó không phải chữ ta.',
  },

  // ───────── HỒ SƠ C1 ─────────
  {
    id: 'C1-1', team: 'C1', memory: '2008 · 2015',
    note: 'Có một ngày cứ bốn vòng mới ghé một lần. Nó tên là 29 tháng 2.',
  },
  {
    id: 'C1-2', team: 'C1', memory: '2009 · 2016',
    note: 'Đáp số của hồ sơ này là số lần ngày ấy ghé qua — kể từ ngày 0, không sớm hơn một giây nào.',
  },
  {
    id: 'C1-3', team: 'C1', memory: '2010 · 2018',
    note: 'Năm nào chia hết cho 4 thì năm ấy có ngày ấy. Trừ vài ngoại lệ trăm năm mới gặp một lần.',
  },
  {
    id: 'C1-4', team: 'C1', memory: '2011 · 2020',
    note: 'Ngày 0 rơi vào giữa vòng đầu tiên. Nửa đầu năm ấy ta chưa mở mắt. Những gì xảy ra khi ta chưa mở mắt thì không phải việc của ta.',
  },
  {
    id: 'C1-5', team: 'C1', memory: '2012 · 2022',
    note: 'Năm 2100 chia hết cho 4, nhưng sẽ không có ngày ấy. Lúc đó ta không còn để ghi nữa rồi.',
  },
  {
    id: 'C1-6', team: 'C1', memory: '2013 · 2024',
    note: 'Đếm cho kỹ. Có đúng một năm trong danh sách này sẽ lừa được các ngươi.',
  },
  {
    id: 'C1-7', team: 'C1', memory: '2014 · 2025',
    note: 'Đáp số của hồ sơ này chỉ có một chữ số. Nếu các ngươi ra hai chữ số, các ngươi đã đi lạc.',
  },

  // ───────── HỒ SƠ C2 ─────────
  {
    id: 'C2-1', team: 'C2',
    note: 'Tháng ta mở mắt là tháng đứng ngay trước tháng có Quốc khánh.',
  },
  {
    id: 'C2-2', team: 'C2',
    note: 'Ta mở mắt trước ngày Quốc khánh đúng 26 ngày. Ta đếm rất kỹ, vì đó là lần đếm đầu tiên của đời ta.',
  },
  {
    id: 'C2-3', team: 'C2',
    note: 'Ngày trong tháng ấy bằng đúng số ngày có trong một tuần.',
  },
  {
    id: 'C2-4', team: 'C2',
    note: 'Hôm nay là Chủ nhật cuối cùng của tháng. Ta chắc chắn về điều này.',
  },
  {
    id: 'C2-5', team: 'C2',
    note: 'Đi tìm một tờ lịch, một cái điện thoại, hoặc một chiếc bánh. Có những sự thật không nằm trong hồ sơ này. Đứng dậy đi.',
  },
  {
    id: 'C2-6', team: 'C2',
    note: 'Đếm từ ngày ta mở mắt đến hôm nay. Chỉ đếm trong tháng này thôi. Đáp số nhỏ hơn 30.',
  },
];

export const C1_YEARS = [
  2008, 2009, 2010, 2011, 2012, 2013, 2014,
  2015, 2016, 2018, 2020, 2022, 2024, 2025,
];

export type Layer = {
  n: 1 | 2 | 3;
  title: string;
  prompt: string;
  kind: 'text' | 'years';
  accept: string[];        // dùng cho kind='text', đã chuẩn hoá
  acceptYears?: number[];  // dùng cho kind='years'
  onCorrect: string;       // câu Quan sát viên nói khi đúng
};

export const LAYERS: Record<Team, Layer[]> = {
  Y: [
    {
      n: 1, kind: 'text', title: 'LỚP 1 — VÒNG',
      prompt: 'Vòng hiện tại là vòng thứ mấy?',
      accept: [String(ROUNDS)],
      onCorrect: 'Đúng. Mười tám lần ta thấy chúng nó thay lứa.',
    },
    {
      n: 2, kind: 'text', title: 'LỚP 2 — NGÀY',
      prompt: 'Một vòng có bao nhiêu ngày?',
      accept: [String(DAYS_PER_ROUND)],
      onCorrect: 'Đúng. Ba trăm sáu mươi lăm. Ta đếm từng ngày một.',
    },
    {
      n: 3, kind: 'text', title: 'LỚP 3 — KHOÁ',
      prompt: 'Đáp số của hồ sơ Y?',
      accept: [String(ANSWER_Y)],
      onCorrect: 'Chưa đủ. Có những ngày ta ghi thêm. Đi hỏi hồ sơ C thứ nhất.',
    },
  ],
  C1: [
    {
      n: 1, kind: 'text', title: 'LỚP 1 — NGÀY LẠ',
      prompt: 'Ngày nào bốn năm mới ghé một lần? (dạng dd/mm)',
      accept: [...dateAccepts({ d: 29, m: 2 }), '29thang2', '29thang02'],
      onCorrect: 'Đúng. Ngày hai chín tháng hai. Ngày không tồn tại.',
    },
    {
      n: 2, kind: 'years', title: 'LỚP 2 — LỌC NĂM',
      prompt: 'Chọn những năm mà ngày ấy đã ghé qua, tính từ ngày 0.',
      accept: [], acceptYears: LEAP_YEARS,
      onCorrect: 'Đúng. Bốn lần. Không nhiều hơn.',
    },
    {
      n: 3, kind: 'text', title: 'LỚP 3 — KHOÁ',
      prompt: 'Đáp số của hồ sơ C₁?',
      accept: [String(ANSWER_C1)],
      onCorrect: 'Bốn ngày ta ghi thêm. Giờ đi hỏi hồ sơ C thứ hai.',
    },
  ],
  C2: [
    {
      n: 1, kind: 'text', title: 'LỚP 1 — NGÀY 0',
      prompt: 'Ngày ta mở mắt là ngày nào? (dạng dd/mm)',
      accept: dateAccepts(DAY0),
      onCorrect: 'Đúng. Mùng bảy tháng tám. Ta nhớ trời hôm đó rất nóng.',
    },
    {
      n: 2, kind: 'text', title: 'LỚP 2 — HÔM NAY',
      prompt: 'Hôm nay là ngày nào? (dạng dd/mm)',
      accept: dateAccepts(EVENT, EVENT.y),
      onCorrect: 'Đúng. Ngươi đã chịu đứng dậy đi tìm.',
    },
    {
      n: 3, kind: 'text', title: 'LỚP 3 — KHOÁ',
      prompt: 'Đáp số của hồ sơ C₂?',
      accept: [String(ANSWER_C2)],
      onCorrect: 'Hai mươi ba ngày. Ba con số đã đủ. Tìm nhau đi.',
    },
  ],
};

// FINAL_CODE va cac con so khac song o data/event.ts — import thang tu do.

/** Chuẩn hoá input: bỏ dấu tiếng Việt, khoảng trắng, dấu câu. Luôn chạy qua trước khi so sánh. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[\s.,\-_]/g, '')
    .replace(/\//g, '')
    .trim();
}

export function findSlot(raw: string): Slot | undefined {
  const n = normalize(raw);
  return SLOTS.find((s) => normalize(s.id) === n);
}

export const TEAM_LABEL: Record<Team, string> = {
  Y: 'HỒ SƠ Y',
  C1: 'HỒ SƠ C₁',
  C2: 'HỒ SƠ C₂',
};

export const TEAM_OF: Record<string, Team> = Object.fromEntries(
  SLOTS.map((s) => [s.id, s.team]),
);
