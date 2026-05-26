"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import Link from "next/link";
import { getFollowers, getFollowing } from "@/actions/follow.action";

interface User {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  bio: string | null;
}

interface FollowersModalProps {
  username: string;
  followersCount: number;
  followingCount: number;
}

export default function FollowersModal({ username, followersCount, followingCount }: FollowersModalProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"followers" | "following">("followers");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function openModal(type: "followers" | "following") {
    setTab(type);
    setOpen(true);
    setLoading(true);
    const data = type === "followers"
      ? await getFollowers(username)
      : await getFollowing(username);
    setUsers(data);
    setLoading(false);
  }

  async function switchTab(type: "followers" | "following") {
    setTab(type);
    setLoading(true);
    const data = type === "followers"
      ? await getFollowers(username)
      : await getFollowing(username);
    setUsers(data);
    setLoading(false);
  }

  return (
    <>
      {/* Stat buttons */}
      <div className="flex gap-6 border-t border-white/10 pt-4">
        <div className="text-center cursor-default">
          <p className="text-white font-bold text-sm">{followersCount}</p>
          <button
            onClick={() => openModal("followers")}
            className="text-white/40 text-xs hover:text-white/70 transition-colors"
          >
            Followers
          </button>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{followingCount}</p>
          <button
            onClick={() => openModal("following")}
            className="text-white/40 text-xs hover:text-white/70 transition-colors"
          >
            Following
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-black border border-white/15 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex gap-1">
                  <button
                    onClick={() => switchTab("followers")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      tab === "followers" ? "bg-white text-black" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Followers
                  </button>
                  <button
                    onClick={() => switchTab("following")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      tab === "following" ? "bg-white text-black" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Following
                  </button>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* User list */}
              <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                {loading && (
                  <div className="text-center py-10 text-white/20 text-sm">Loading...</div>
                )}

                {!loading && users.length === 0 && (
                  <div className="text-center py-10 text-white/20 text-sm">
                    {tab === "followers" ? "No followers yet." : "Not following anyone yet."}
                  </div>
                )}

                {!loading && users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <Link
                      href={`/profile/${user.username}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <Avatar src={user.image} username={user.username} size={40} />
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{user.name ?? user.username}</p>
                        <p className="text-white/40 text-xs">@{user.username}</p>
                        {user.bio && <p className="text-white/30 text-xs truncate mt-0.5">{user.bio}</p>}
                      </div>
                    </Link>
                    <FollowButton targetUserId={user.id} />
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
