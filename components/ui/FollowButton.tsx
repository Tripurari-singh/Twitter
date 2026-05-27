"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { toggleFollow } from "@/actions/follow.action";
import { useRouter } from "next/navigation";

export default function FollowButton({
  targetUserId,
  initialFollowing = false,
}: {
  targetUserId: string;
  initialFollowing?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleFollow(targetUserId);
      console.log("toggleFollow result:", result);
      if (result.success) {
        setFollowing(result.data.following);
        router.refresh();
      } else {
        console.error("toggleFollow error:", result.error);
      }
    } catch (e) {
      console.error("toggleFollow exception:", e);
    }
    setLoading(false);
  }

  return (
    <motion.button
      onClick={handleFollow}
      disabled={loading}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      className={`
        shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${following
          ? hovered
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-white/5 border-white/20 text-white"
          : "bg-white text-black border-white hover:bg-white/90"
        }
      `}
    >
      {loading ? "..." : following ? (hovered ? "Unfollow" : "Following") : "Follow"}
    </motion.button>
  );
}
