import { notFound } from "next/navigation";
import PlayClient from "@/components/PlayClient";
import { SLOTS, findSlot } from "@/data/game";

export function generateStaticParams() {
  return SLOTS.map((s) => ({ slot: s.id }));
}

export default async function PlayPage({ params }: PageProps<"/play/[slot]">) {
  const { slot } = await params;
  const found = findSlot(decodeURIComponent(slot));
  if (!found) notFound();
  return <PlayClient slot={found} />;
}
