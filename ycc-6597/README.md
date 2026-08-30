# MÃ 6597 · Nhật ký Quan sát viên

Web app cho buổi sinh hoạt 18 tuổi của **Young Creation Club** — 30/08/2026, ~20 người, một phòng có máy chiếu.

> **In bản giấy dù có web.** Wifi chết giữa chừng là hỏng cả buổi, 20 phong bì thì luôn chạy được.
> Bản giấy nằm ở route **`/in`** — bấm In, cắt theo đường đứt, bỏ phong bì.

## Chạy

```bash
npm run dev
```

## Deploy

```bash
npx vercel --prod
```

Sau khi deploy, **mở `/host` trên domain thật và kiểm tra QR** — QR trỏ về `localhost` là lỗi hay gặp nhất. QR được sinh từ `window.location.origin` nên tự đúng theo domain đang mở.

## Routes

| Route | Dùng cho | Mô tả |
| --- | --- | --- |
| `/` | Điện thoại | Redirect sang `/join` — domain trần là thứ người chơi gõ tay khi QR hỏng |
| `/host` | Máy chiếu | QR + 5 màn chiếu + đồng hồ đếm xuôi theo phút của buổi |
| `/join` | Điện thoại | Nhập mã slot rồi chuyển sang `/play/[slot]` |
| `/play/[slot]` | Điện thoại | Mảnh riêng + 3 lớp khoá của tổ + nút đổi mã |
| `/final` | Điện thoại | Ô nhập mã cuối 4 chữ số |
| `/chia` | Máy MC | Chia người thành 3 tổ Y / C₁ / C₂ + gán mã phong bì. Phút 48–53. |
| `/in` | Máy MC | **In 20 mảnh để bỏ phong bì.** Bản giấy dự phòng khi wifi chết. |
| `/mc` | Điện thoại của MC | Bảng đáp án + gợi ý. **Không link từ đâu cả.** |

Máy chiếu mở thẳng `/host`, không mở domain trần.

Điều khiển `/host`: `←` `→` hoặc `Space`. Đồng hồ **đếm xuôi** từ 0 theo phút của cả buổi, khớp
với các mốc "Phút 70 / 86" trong ghi chú MC — nhìn đồng hồ là biết đang trễ hay sớm so với kịch
bản. Slide và đồng hồ được lưu `localStorage` nên **máy chiếu bị reload giữa buổi không mất nhịp**
(khoảng thời gian trang đóng vẫn được cộng bù). Nút Reset phải bấm hai lần.

`/chia` chỉ link từ `/mc`, không lộ ra màn chiếu. Dán danh sách tên (mỗi dòng một người) rồi bấm **Chia tổ** — kết quả lưu `localStorage`, bấm **In** ra bản giấy để soạn phong bì.

**Luật chia:** cả 20 mảnh luôn phải có người cầm, thiếu một mảnh là hỏng một lớp khoá. Nên nếu
đông hơn 20 thì có phong bì 2 người chung; nếu ít hơn 20 thì có người giữ 2 phong bì. Cả hai
trường hợp đều hiện cảnh báo.

Người chia vào 3 tổ theo đúng tỉ lệ số mã (7 : 7 : 6) bằng largest-remainder, nên không tổ nào
bị phình. Khi ít hơn 20 người, **hai mã của người giữ 2 phong bì luôn nằm trong cùng một tổ** —
nếu không thì người đó phải ngồi hai chỗ cùng lúc. `/chia` in ra hai bảng: theo mã (soạn phong
bì) và theo người (gọi tên, xếp chỗ ngồi).

## Cấu trúc

```
data/event.ts         Hai mốc ngày -> mọi đáp án, mã cuối, chữ trên máy chiếu
data/game.ts          20 mảnh, 3 tổ × 3 lớp khoá, normalize()
components/           Starfield, PlayClient, LineSequence, Reveal
app/                  8 routes
public/mascot/        astronaut.png · astronaut-small.png · mascot-birthday.png
public/slides/        slide-boi-canh · slide-nhieu · slide-phep-tinh · slide-reveal
tools/mascot.py       Sinh lại toàn bộ pixel art: python tools/render.py
tools/check.mjs       Tự kiểm tra toàn bộ phép tính: node tools/check.mjs
```

## Đổi ngày sự kiện

Mọi con số đều tính ra từ **hai mốc ngày** trong `data/event.ts`:

```ts
export const DAY0  = { y: 2008, m: 8, d: 7 };   // ngày thành lập
export const EVENT = { y: 2026, m: 8, d: 30 };  // ngày diễn ra
```

Đổi hai dòng này là đáp án từng lớp, mã cuối, bảng đáp án MC và chữ trên máy chiếu tự đổi theo.
Chạy `node tools/check.mjs` để kiểm tra lại 17 khẳng định — kể cả những thứ không nằm trong code
như "ngày sự kiện phải là Chủ nhật cuối tháng" (mảnh C2-4) và "tổng chữ số phải bằng 27" (màn
reveal). Script sẽ báo đỏ nếu đổi ngày làm hỏng một mảnh nào đó.

## Quy tắc font — đọc trước khi sửa UI

**Press Start 2P không có dấu tiếng Việt.** Render "NHẬT KÝ" bằng font này sẽ mất dấu hoặc ra ô vuông.

- Chữ có dấu → `Be Vietnam Pro` (mặc định, không cần class)
- Số và mã slot → thêm class `font-display`

`components/PlayClient.tsx` có hàm `pixelSafe()` chặn sẵn trường hợp người chơi gõ tiếng Việt vào ô đáp án.

## Nên thay trước khi chạy thật

Ba trang nhật ký **Y2** (2014), **Y3** (2021), **Y5** (2019) trong `data/game.ts` đang dùng lời
trung tính — tả cảnh nhìn từ quỹ đạo, không khẳng định sự kiện có thật nào của CLB. Chơi được
ngay, nhưng thay bằng sự kiện thật của từng năm sẽ hay hơn nhiều.

Ba chuỗi này in thẳng ra `/in`, nên nếu định thay thì **thay trước khi in phong bì**.

Nếu CLB đánh Gen khác giả định (Gen 1 = 2008–2009, Gen 18 = 2025–2026) thì phải sửa quy luật trong `note` của Y5 và đáp án lớp 1 tổ Y.

## Đã kiểm tra

- 20 mã slot vào đúng trang, chấp nhận `y1` / `Y1` / `c1 3` / `C1-3`
- Lớp 2 khoá cho tới khi lớp 1 đúng; `18` đúng, `19` sai
- Bẫy năm nhuận: `2012+2016+2020+2024` đúng, thêm `2008` sai
- `7/8` và `07/08` đều được chấp nhận
- Reload giữa chừng → tiến độ còn nguyên (`localStorage`)
- `/final`: nhận `6597`, từ chối `6935` / `6598` / `6574`, khoá 20 giây sau 3 lần sai
- 5 màn `/host` chuyển bằng phím mũi tên, đồng hồ không reset
- Không chữ tiếng Việt nào bị mất dấu
- `/chia`: mọi số người từ 3 đến 30 đều phủ đủ 20 mã, không tổ nào trống, và không ai
  bị phát hai mã ở hai tổ khác nhau
- `/join?doi=1` không bị đá về `/play` — người giữ 2 phong bì đổi mã được
- `node tools/check.mjs`: 17/17 khẳng định khớp
- `npm run lint` sạch, `npm run build` sạch

## Ghi chú kỹ thuật

Scaffold bằng `create-next-app@latest` nên ra **Next.js 16.3.3** thay vì 15 như SPEC ghi — App Router, API và cấu trúc thư mục giữ nguyên, không ảnh hưởng gì.
