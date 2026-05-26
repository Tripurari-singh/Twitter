import { getUserPosts } from "@/actions/post.action";
import { getCurrentUser } from "@/actions/user.action";
import PostCard from "./PostCard";

export default async function UserPostFeed({ username }: { username: string }) {
  const [{ posts }, currentUser] = await Promise.all([
    getUserPosts(username),
    getCurrentUser(),
  ]);

  if (!currentUser) return null;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/20 text-lg font-medium">No posts yet</p>
        <p className="text-white/10 text-sm mt-1">This user hasn't posted anything yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUser.id} />
      ))}
    </div>
  );
}
