"use client";

import { markAllNotificationsRead } from "@/actions/notification.action";
import { useRouter } from "next/navigation";

export default function MarkAllRead() {
  const router = useRouter();

  async function handleMarkAll() {
    await markAllNotificationsRead();
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkAll}
      className="text-xs text-sky-400 hover:text-sky-300 transition-colors border border-sky-400/20 px-3 py-1 rounded-full hover:border-sky-400/40"
    >
      Mark all read
    </button>
  );
}
