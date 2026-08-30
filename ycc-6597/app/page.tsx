import { redirect } from "next/navigation";

/**
 * Domain trần là thứ người chơi gõ tay khi quét QR hỏng.
 * Nên nó phải ra /join, không phải màn máy chiếu.
 * Máy chiếu mở thẳng /host.
 */
export default function Home() {
  redirect("/join");
}
