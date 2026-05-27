"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Send, Copy, Check, ArrowLeft } from "lucide-react";
import { createPost } from "@/actions/post.action";
import { useRouter } from "next/navigation";

const tones = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "humorous", label: "Humorous" },
  { id: "inspirational", label: "Inspirational" },
  { id: "informative", label: "Informative" },
];

export default function AIComposer() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("casual");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setGenerated("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to generate post");
      } else {
        setGenerated(data.post);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  async function handlePost() {
    if (!generated.trim() || posting) return;
    setPosting(true);

    const result = await createPost({ content: generated });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
      setPosting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const remaining = 280 - generated.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-white font-bold text-xl flex items-center gap-2">
            <Sparkles size={20} className="text-sky-400" />
            AI Post Composer
          </h1>
          <p className="text-white/40 text-sm">Generate engaging posts with AI</p>
        </div>
      </div>

      {/* Prompt input */}
      <div
        className="border border-white/10 rounded-2xl bg-black p-4 space-y-4"
        style={{ borderRadius: 20 }}
      >
        <div>
          <label className="text-white/50 text-xs font-medium mb-2 block">
            WHAT DO YOU WANT TO POST ABOUT?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. The future of AI in everyday life, my morning coffee ritual, a productivity tip..."
            rows={3}
            className="w-full bg-transparent outline-none placeholder:text-white/20 text-white text-sm resize-none"
          />
        </div>

        {/* Tone selector */}
        <div>
          <label className="text-white/50 text-xs font-medium mb-2 block">TONE</label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                  ${tone === t.id
                    ? "bg-sky-500 border-sky-500 text-white"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                <Sparkles size={16} />
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Post
            </>
          )}
        </motion.button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-red-500/20 bg-red-500/10 rounded-xl p-3 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated result */}
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/10 rounded-2xl bg-black overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            {/* Result header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-white/50 text-xs font-medium">GENERATED POST</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${isOverLimit ? "text-red-400" : remaining <= 20 ? "text-amber-400" : "text-white/30"}`}>
                  {remaining} chars left
                </span>
                <button
                  onClick={handleCopy}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Editable result */}
            <textarea
              value={generated}
              onChange={(e) => setGenerated(e.target.value)}
              rows={4}
              className="w-full bg-transparent outline-none text-white text-sm resize-none p-4"
            />

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs"
              >
                <RefreshCw size={13} />
                Regenerate
              </button>

              <motion.button
                onClick={handlePost}
                disabled={posting || isOverLimit || !generated.trim()}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-5 py-2 rounded-full hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {posting ? (
                  "Posting..."
                ) : (
                  <>
                    <Send size={14} />
                    Post to Threadly
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
