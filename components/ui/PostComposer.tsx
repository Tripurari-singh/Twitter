"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Feather } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { createPost } from "@/actions/post.action";

const PostComposer = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const remaining = 280 - content.length;
  const isOverLimit = remaining < 0;
  const isEmpty = content.trim().length === 0;

  async function handlePost() {
    if (isEmpty || isOverLimit || loading) return;
    setLoading(true);
    setError("");

    const result = await createPost({ content });

    if (result.success) {
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="relative w-full">
      <div
        className="relative z-10 w-full border border-white/10 bg-black text-white"
        style={{ borderRadius: 25 }}
      >
        {/* Top — avatar + textarea */}
        <div className="flex gap-3 p-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium text-sm">{initials}</span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent outline-none placeholder:text-white/30 text-white text-base pt-2"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-4" />

        {/* Bottom bar */}
        <div className="relative pt-10">
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="absolute top-0 w-full px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="flex h-10 items-center justify-between rounded-full bg-red-500/10 border border-red-500/20 px-4">
                  <span className="text-xs text-red-400">{error}</span>
                  <button onClick={() => setError("")}>
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions row */}
          <div className="flex items-center justify-between px-4 pb-3">
            {/* Left — icons + char count */}
            <div className="flex items-center gap-3">
              <button className="text-white/30 hover:text-sky-400 transition-colors" title="Image (coming soon)">
                <ImageIcon size={20} />
              </button>

              {/* Char counter */}
              <div className="flex items-center gap-1">
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2.5" />
                  <circle
                    cx="14" cy="14" r="11"
                    fill="none"
                    stroke={isOverLimit ? "#ef4444" : remaining <= 20 ? "#f59e0b" : "#38bdf8"}
                    strokeWidth="2.5"
                    strokeDasharray={`${2 * Math.PI * 11}`}
                    strokeDashoffset={`${2 * Math.PI * 11 * (1 - Math.min(content.length, 280) / 280)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 14 14)"
                    style={{ transition: "stroke-dashoffset 0.2s, stroke 0.2s" }}
                  />
                </svg>
                {remaining <= 20 && (
                  <span className={`text-xs font-medium ${isOverLimit ? "text-red-400" : "text-amber-400"}`}>
                    {remaining}
                  </span>
                )}
              </div>
            </div>

            {/* Right — Post button */}
            <motion.button
              onClick={handlePost}
              disabled={isEmpty || isOverLimit || loading}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 transition-colors"
              style={{ borderRadius: 25 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <Feather size={14} />
                  </motion.div>
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-12 flex w-full items-center justify-center rounded-b-3xl border border-white/10 bg-white/5 p-3 pt-6"
          >
            <p className="text-xs font-medium text-sky-400">
              ✓ Post published successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostComposer;
