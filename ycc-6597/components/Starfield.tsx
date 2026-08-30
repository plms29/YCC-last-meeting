/**
 * Starfield pixel dong ve bang CSS thuan (SPEC muc 4 · signature element).
 * Khong canvas, khong JS. Nhap nhay tat khi prefers-reduced-motion.
 */
export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <span className="s1" />
      <span className="s2" />
      <span className="s3" />
      <span className="s4" />
    </div>
  );
}
