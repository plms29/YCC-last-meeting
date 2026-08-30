# YCC-last-meeting

Buổi sinh hoạt 18 tuổi của **Young Creation Club** — 30/08/2026.
Một trò giải đố tập thể chạy trong ~90 phút: 20 mảnh ký ức, 3 tổ, 3 lớp khoá, một mã cuối.

| Thư mục | Nội dung |
| --- | --- |
| [`ycc-6597/`](ycc-6597/) | Web app Next.js — 8 route. **Đọc [README của app](ycc-6597/README.md) trước.** |
| `art/` | Pixel art nguồn (mascot, 4 slide) |
| `tools/` | `render.py` sinh lại art · `check.mjs` kiểm tra phép tính của trò chơi |

## Chạy

```bash
npm --prefix ycc-6597 run dev
```

## Kiểm tra phép tính

```bash
node tools/check.mjs
```

Mọi con số của trò chơi sinh ra từ hai mốc ngày trong `ycc-6597/data/event.ts`.
Đổi ngày thì chạy lại script này — nó kiểm 17 khẳng định, gồm cả những thứ không nằm
trong code như "ngày sự kiện phải là Chủ nhật cuối tháng".
