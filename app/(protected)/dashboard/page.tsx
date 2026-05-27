import PostComposer from "@/components/ui/PostComposer";
import PostFeed from "@/components/ui/PostFeed";
import { getSuggestedUsers, getCurrentUser } from "@/actions/user.action";
import Avatar from "@/components/ui/Avatar";
import FollowButton from "@/components/ui/FollowButton";
import Link from "next/link";

export default async function DashboardPage() {
  const [suggested, currentUser] = await Promise.all([
    getSuggestedUsers(),
    getCurrentUser(),
  ]);

  return (
    <div className="flex gap-0">
      {/* Feed */}
      <div className="flex-1 max-w-2xl border-r border-white/10">
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-white/10 px-4 py-3">
          <h1 className="text-white font-bold text-lg">Home</h1>
        </div>
        <div className="p-4 space-y-4">
          <PostComposer />
          <div className="h-px bg-white/10" />
          <PostFeed />
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-col w-80 px-4 py-4 gap-4 sticky top-0 h-screen overflow-y-auto">
        {/* Who to follow */}
        <div className="border border-white/10 rounded-2xl p-4 bg-black">
          <h2 className="text-white font-bold text-base mb-4">Who to follow</h2>
          {suggested.length === 0 ? (
            <p className="text-white/20 text-sm">No suggestions right now.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {suggested.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-2">
                  <Link href={`/profile/${user.username}`} className="flex items-center gap-2 min-w-0">
                    <Avatar src={user.image} username={user.username} size={36} />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{user.name ?? user.username}</p>
                      <p className="text-white/40 text-xs truncate">@{user.username}</p>
                    </div>
                  </Link>
                  <FollowButton targetUserId={user.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current user card */}
        {currentUser && (
          <div className="border border-white/10 rounded-2xl p-4 bg-black">
            <Link href={`/profile/${currentUser.username}`} className="flex items-center gap-3">
              <Avatar src={currentUser.image} username={currentUser.username} size={40} />
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{currentUser.name ?? currentUser.username}</p>
                <p className="text-white/40 text-xs truncate">@{currentUser.username}</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
