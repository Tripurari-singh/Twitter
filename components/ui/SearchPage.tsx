"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchUsers } from "@/actions/user.action";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import Link from "next/link";

type UserResult = {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  _count: { followers: number };
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(val: string) {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const data = await searchUsers(val);
    setResults(data);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-white font-bold text-xl mb-4">Search</h1>

      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search people..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors text-sm"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setSearched(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-white/20 text-sm">Searching...</p>
          </motion.div>
        )}

        {!loading && searched && results.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 border border-white/10 rounded-2xl">
            <p className="text-white/20 text-lg font-medium">No users found</p>
            <p className="text-white/10 text-sm mt-1">Try a different search term.</p>
          </motion.div>
        )}

        {!loading && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
            {results.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-black hover:border-white/20 transition-all"
              >
                <Link href={`/profile/${user.username}`} className="flex items-center gap-3 min-w-0">
                  <Avatar src={user.image} username={user.username} size={44} />
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{user.name ?? user.username}</p>
                    <p className="text-white/40 text-xs">@{user.username}</p>
                    {user.bio && <p className="text-white/30 text-xs mt-0.5 truncate">{user.bio}</p>}
                    <p className="text-white/20 text-xs mt-0.5">{user._count.followers} followers</p>
                  </div>
                </Link>
                <FollowButton targetUserId={user.id} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
