"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useState } from "react";
import LineSequence from "@/components/LineSequence";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";
import { TOTAL_DAYS, vn } from "@/data/event";

/**
 * Moi man chieu gan voi mot moc phut cua ca buoi.
 * Dong ho dem XUOI tu 0 nen nhin dong ho la biet dang tre hay som so voi kich ban.
 * Sua so o day la sua luon nhac nho duoi chan man hinh.
 */
const SLIDES = [
  {
    id: "LOBBY",
    mark: 50,
    hint: "Chờ cả phòng quét mã. Poster GEN 18 phải đang treo trên tường.",
  },
  {
    id: "BOI_CANH",
    mark: 55,
    hint: "Đọc chậm 5 dòng bối cảnh. Xong thì phát phong bì.",
  },
  {
    id: "NHIEU",
    mark: 70,
    hint: "Dừng nhạc rồi mới chiếu.",
  },
  {
    id: "PHEP_TINH",
    mark: 86,
    hint: "Không đọc ba con số ra — để các tổ tự mang tới.",
  },
  {
    id: "REVEAL",
    mark: 90,
    hint: "Dòng cuối hiện xong: tắt đèn, bánh vào phòng.",
  },
] as const;

const BOI_CANH = [
  "Ngày 0. Một Quan sát viên được thả xuống quỹ đạo Trái Đất với một nhiệm vụ duy nhất: ghi lại mọi ngày của YCC.",
  `Nó đã làm việc đó ${vn(TOTAL_DAYS)} ngày liên tục. Không nghỉ một ngày nào.`,
  "03:07 sáng nay, tín hiệu đứt. Bộ nhớ của nó vỡ thành từng mảnh và rơi xuống — vào tay 20 người trong căn phòng này.",
  "Quan sát viên chỉ tỉnh lại nếu nhận đúng mã khôi phục bốn chữ số: chính là số ngày nó đã quan sát.",
  "Không ai trong các bạn giữ đủ mảnh. Và một trong các mảnh đã bị làm giả.",
];

const STORE = "ycc:host";

type Saved = { slide: number; elapsed: number; running: boolean; at: number };

export default function HostPage() {
  const [slide, setSlide] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [origin, setOrigin] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Khoi phuc sau khi reload. Neu dong ho dang chay thi cong bu khoang thoi gian
  // trang bi dong — may chieu bi reload giua buoi khong duoc lam mat nhip.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- window/localStorage chi doc duoc sau khi mount */
    setOrigin(window.location.origin);
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        if (typeof s?.elapsed === "number") {
          const gap = s.running ? Math.floor((Date.now() - s.at) / 1000) : 0;
          setSlide(s.slide ?? 0);
          setElapsed(s.elapsed + Math.max(0, gap));
          setRunning(!!s.running);
        }
      }
    } catch {
      /* localStorage bi chan -> bat dau tu 0, khong sao */
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Ghi lai moi thay doi. Ghi ca `at` de lan sau con biet ma cong bu.
  useEffect(() => {
    if (!loaded) return;
    try {
      const s: Saved = { slide, elapsed, running, at: Date.now() };
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {
      /* bo qua */
    }
  }, [slide, elapsed, running, loaded]);

  const go = useCallback(
    (d: number) => setSlide((s) => Math.min(SLIDES.length - 1, Math.max(0, s + d))),
    [],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const bar = (
    <HostBar
      slide={slide}
      go={go}
      elapsed={elapsed}
      running={running}
      setRunning={setRunning}
      reset={() => setElapsed(0)}
    />
  );

  if (SLIDES[slide].id === "REVEAL") {
    return (
      <main className="bg-void relative h-dvh overflow-hidden">
        <Image
          src="/slides/slide-reveal.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="bg-void/70 absolute inset-0" />
        <Reveal size="host" bg="bg-transparent" />
        {/* Lam mo dieu khien o man chot — di chuot vao moi hien lai */}
        <div className="opacity-20 transition-opacity duration-300 hover:opacity-100">{bar}</div>
      </main>
    );
  }

  return (
    <main className="bg-void relative h-dvh overflow-hidden">
      <Starfield />

      {SLIDES[slide].id === "LOBBY" && (
        <section className="relative z-10 flex h-dvh flex-col items-center justify-center gap-8">
          <div className="bg-helmet p-6">
            {origin ? (
              <QRCodeSVG value={`${origin}/join`} size={420} level="M" includeMargin={false} />
            ) : (
              <div className="h-[420px] w-[420px]" />
            )}
          </div>
          <div className="text-center">
            <p className="font-display text-signal text-2xl">MA {TOTAL_DAYS}</p>
            <p className="text-helmet mt-4 text-3xl">Quét mã.</p>
            <p className="text-dust mt-2 text-2xl">Nhập mã trên phong bì của ngươi.</p>
            {/* QR loa den chieu la ca phong dung hinh — luon co duong go tay */}
            <p className="text-dust mt-5 text-lg">
              Quét không được thì gõ:{" "}
              <span className="font-display text-signal text-xl">
                {origin.replace(/^https?:\/\//, "")}
              </span>
            </p>
          </div>
        </section>
      )}

      {SLIDES[slide].id === "BOI_CANH" && (
        <section className="relative z-10 h-dvh">
          <Image
            src="/slides/slide-boi-canh.png"
            alt=""
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="from-void via-void/85 absolute inset-0 bg-gradient-to-r to-transparent" />
          <LineSequence
            lines={BOI_CANH}
            stepMs={1600}
            className="absolute inset-y-0 left-0 flex w-full flex-col justify-center gap-7 px-16 lg:w-3/5"
            lineClassName="text-helmet text-2xl leading-relaxed lg:text-3xl"
          />
        </section>
      )}

      {SLIDES[slide].id === "NHIEU" && (
        <section className="relative z-10 h-dvh">
          <Image src="/slides/slide-nhieu.png" alt="" fill priority className="object-cover" />
          <div className="from-void/95 via-void/60 to-void/95 absolute inset-0 flex flex-col items-center justify-center gap-8 bg-gradient-to-b px-10 text-center">
            <p className="text-alarm font-display text-3xl lg:text-5xl">⚠ TIN HIEU NHIEU</p>
            <p className="text-helmet max-w-4xl text-3xl leading-relaxed lg:text-4xl">
              MỘT TRONG HAI MƯƠI MẢNH KHÔNG PHẢI CHỮ TA VIẾT.
            </p>
            <p className="text-dust max-w-4xl text-2xl leading-relaxed lg:text-3xl">
              NẾU SỐ CỦA NGƯƠI RA ĐẸP QUÁ — HÃY NGHI NGỜ NÓ.
            </p>
          </div>
        </section>
      )}

      {SLIDES[slide].id === "PHEP_TINH" && (
        <section className="relative z-10 h-dvh">
          <Image src="/slides/slide-phep-tinh.png" alt="" fill priority className="object-cover" />
          <div className="absolute inset-x-0 bottom-24 flex justify-center px-10">
            <p className="text-helmet text-center text-3xl leading-relaxed lg:text-4xl">
              “Y trước. C sau. C sau nữa. Ta chỉ biết cộng.”
            </p>
          </div>
        </section>
      )}

      {bar}
    </main>
  );
}

function HostBar({
  slide,
  go,
  elapsed,
  running,
  setRunning,
  reset,
}: {
  slide: number;
  go: (d: number) => void;
  elapsed: number;
  running: boolean;
  setRunning: (v: boolean) => void;
  reset: () => void;
}) {
  const [armed, setArmed] = useState(false);

  // Tu bo trang thai "Chac chu?" sau 3 giay de khong lo bam Reset o lan sau
  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(id);
  }, [armed]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const mark = SLIDES[slide].mark;
  const minute = Math.floor(elapsed / 60);
  const drift = minute - mark;

  return (
    <>
      {/* dong ho — dem xuoi theo phut cua ca buoi */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-4">
        <div className="text-right">
          <span className="font-display text-helmet text-4xl tabular-nums">
            {mm}:{ss}
          </span>
          <p className="text-dust mt-1 text-[10px] tracking-widest uppercase">Phút của buổi</p>
        </div>
        <button className="px-btn px-3 py-2 text-sm" onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        {/* Bam nham Reset giua buoi la mat nhip — bat bam hai lan */}
        <button
          className={`px-btn px-3 py-2 text-sm ${armed ? "border-alarm text-alarm" : ""}`}
          onClick={() => {
            if (!armed) {
              setArmed(true);
              return;
            }
            setArmed(false);
            setRunning(false);
            reset();
          }}
        >
          {armed ? "Chắc chứ?" : "Reset"}
        </button>
      </div>

      {/* dieu khien slide */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i - slide)}
            className={`px-btn font-display px-3 py-2 text-[10px] ${
              i === slide ? "border-signal text-signal" : "text-dust"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* nhac nho cho MC */}
      <div className="absolute bottom-6 left-8 z-20 max-w-md">
        <p className="text-dust text-xs">
          <span className="font-display text-signal">Phút {mark}</span>
          {drift >= 2 && <span className="text-alarm"> · trễ {drift}&apos;</span>}
          {drift <= -2 && <span className="text-signal"> · sớm {-drift}&apos;</span>}
        </p>
        <p className="text-dust mt-1 text-xs">{SLIDES[slide].hint}</p>
      </div>
      <p className="text-dust absolute top-6 left-8 z-20 text-xs">← → hoặc Space để chuyển màn</p>
    </>
  );
}
