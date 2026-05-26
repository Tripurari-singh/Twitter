"use client";

import { motion } from "framer-motion";
import { Feather } from "lucide-react";

export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      >
        <Feather size={size} className="text-sky-400" />
      </motion.div>
    </div>
  );
}
