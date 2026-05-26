"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toggleLike } from "@/actions/like.action";
import { deletePost } from "@/actions/post.action";
import { addComment, getComments } from "@/actions/comment.action";

interface Author {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  content: string;
  image: string;
  createdAt: Date;
  author: Author;
  likes: { userid: string }[];
  _count: { comments: number; likes: number };
}

export default function PostCard({ post, currentUserId }: { post: Post; currentUserId: string }) {
  const { user } = useUser();
  const [liked, setLiked] = useState(post.likes.some((l) => l.userid === currentUserId));
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Awaited<ReturnType<typeof getComments>>>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = post.author.id === currentUserId;

  const timeAgo = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  async function handleLike() {
    if (loadingLike) return;
    setLoadingLike(true);
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    await toggleLike(post.id);
    setLoadingLike(false);
  }

  async function handleShowComments() {
    if (!showComments) {
      const data = await getComments(post.id);
      setComments(data);
    }
    setShowComments(!showComments);
  }

  async function handleAddComment() {
    if (!commentText.trim() || loadingComment) return;
    setLoadingComment(true);
    const result = await addComment(post.id, commentText);
    if (result.success) {
      setCommentText("");
      setCommentCount(commentCount + 1);
      const data = await getComments(post.id);
      setComments(data);
    }
    setLoadingComment(false);
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    await deletePost(post.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 bg-black rounded-2xl p-4 hover:border-white/20 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
            {post.author.image ? (
              <Image src={post.author.image} alt={post.author.username} width={40} height={40} className="rounded-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium text-sm">
                {post.author.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm group-hover:text-sky-400 transition-colors">
              {post.author.name ?? post.author.username}
            </p>
            <p className="text-white/40 text-xs">@{post.author.username} · {timeAgo(post.createdAt)}</p>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-white/90 text-sm leading-relaxed mb-4 pl-[52px]">{post.content}</p>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-3" />

      {/* Actions */}
      <div className="flex items-center gap-6 pl-[52px]">
        {/* Like */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.85 }}
          className="flex items-center gap-1.5 group"
        >
          <motion.div animate={{ scale: liked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.2 }}>
            <Heart
              size={17}
              className={liked ? "fill-red-500 text-red-500" : "text-white/30 group-hover:text-red-400 transition-colors"}
            />
          </motion.div>
          <span className={`text-xs ${liked ? "text-red-500" : "text-white/30 group-hover:text-red-400"} transition-colors`}>
            {likeCount}
          </span>
        </motion.button>

        {/* Comment */}
        <button
          onClick={handleShowComments}
          className="flex items-center gap-1.5 group"
        >
          <MessageCircle
            size={17}
            className={showComments ? "text-sky-400" : "text-white/30 group-hover:text-sky-400 transition-colors"}
          />
          <span className={`text-xs ${showComments ? "text-sky-400" : "text-white/30 group-hover:text-sky-400"} transition-colors`}>
            {commentCount}
          </span>
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pl-[52px] space-y-3">
              {/* Add comment */}
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden shrink-0">
                  {user?.imageUrl ? (
                    <Image src={user.imageUrl} alt="me" width={28} height={28} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      {user?.firstName?.[0] ?? "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/20"
                  />
                  <motion.button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || loadingComment}
                    whileTap={{ scale: 0.95 }}
                    className="bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white text-xs px-4 py-1.5 rounded-full transition-colors"
                  >
                    {loadingComment ? "..." : "Reply"}
                  </motion.button>
                </div>
              </div>

              {/* Comment list */}
              {comments.length === 0 && (
                <p className="text-white/20 text-xs">No comments yet.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden shrink-0">
                    {c.author.image ? (
                      <Image src={c.author.image} alt={c.author.username} width={28} height={28} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">
                        {c.author.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-2xl px-3 py-2 flex-1">
                    <p className="text-white/60 text-xs font-medium">@{c.author.username}</p>
                    <p className="text-white/80 text-xs mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
