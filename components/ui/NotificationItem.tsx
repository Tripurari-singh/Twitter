"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import Avatar from "./Avatar";
import Link from "next/link";
import { markNotificationRead } from "@/actions/notification.action";

type NotificationType = "LIKE" | "COMMENT" | "FOLLOW";

interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  creator: {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
  };
  post?: { id: string; content: string } | null;
  comment?: { id: string; content: string } | null;
}

const iconMap = {
  LIKE: { icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
  COMMENT: { icon: MessageCircle, color: "text-sky-400", bg: "bg-sky-500/10" },
  FOLLOW: { icon: UserPlus, color: "text-green-400", bg: "bg-green-500/10" },
};

const labelMap = {
  LIKE: "liked your post",
  COMMENT: "commented on your post",
  FOLLOW: "followed you",
};

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { icon: Icon, color, bg } = iconMap[notification.type];

  async function handleRead() {
    if (!notification.read) await markNotificationRead(notification.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleRead}
      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
        ${notification.read
          ? "border-white/5 bg-black hover:border-white/10"
          : "border-white/10 bg-white/5 hover:border-white/20"
        }`}
    >
      {/* Type icon */}
      <div className={`p-2 rounded-full ${bg} shrink-0`}>
        <Icon size={14} className={color} />
      </div>

      {/* Avatar + text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar
            src={notification.creator.image}
            username={notification.creator.username}
            size={28}
          />
          <Link
            href={`/profile/${notification.creator.username}`}
            className="text-white font-semibold text-sm hover:text-sky-400 transition-colors"
          >
            {notification.creator.name ?? notification.creator.username}
          </Link>
          <span className="text-white/40 text-sm">{labelMap[notification.type]}</span>
        </div>

        {/* Post/comment preview */}
        {notification.post && (
          <p className="text-white/30 text-xs truncate mt-1 pl-1 border-l border-white/10">
            {notification.post.content}
          </p>
        )}
        {notification.comment && (
          <p className="text-white/30 text-xs truncate mt-1 pl-1 border-l border-white/10">
            "{notification.comment.content}"
          </p>
        )}

        <p className="text-white/20 text-xs mt-1">
          {new Date(notification.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-1" />
      )}
    </motion.div>
  );
}
