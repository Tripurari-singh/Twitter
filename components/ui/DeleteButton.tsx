"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Check } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  label?: string;
}

export default function DeleteButton({ onDelete, label = "Delete" }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await onDelete();
    setLoading(false);
    setConfirming(false);
  }

  return (
    <div className="relative flex items-center gap-1">
      <AnimatePresence mode="wait">
        {!confirming ? (
          <motion.button
            key="delete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(true)}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
            title={label}
          >
            <Trash2 size={15} />
          </motion.button>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1"
          >
            <span className="text-white/40 text-xs mr-1">Sure?</span>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6 }}>
                  <Feather size={13} />
                </motion.div>
              ) : (
                <Check size={13} />
              )}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Fix missing import
import { Feather } from "lucide-react";
