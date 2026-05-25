import { getCurrentUser, getSuggestedUsers, searchUsers, getUserByUsername } from "@/actions/user.action";
import { createPost, getFeed, getPost, getUserPosts } from "@/actions/post.action";
import { getComments } from "@/actions/comment.action";
import { getFollowers, getFollowing, isFollowing } from "@/actions/follow.action";
import { getNotifications } from "@/actions/notification.action";

export default async function TestPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-8 text-red-500">Not logged in</div>;

  const newPost = await createPost({ content: "Test post from API test page!" });
  const { posts, total: feedTotal } = await getFeed();
  const { posts: userPosts } = await getUserPosts(user.username);
  const singlePost = posts[0] ? await getPost(posts[0].id) : null;
  const comments = posts[0] ? await getComments(posts[0].id) : [];
  const suggested = await getSuggestedUsers();
  const searchResult = await searchUsers(user.username.slice(0, 3));
  const profile = await getUserByUsername(user.username);
  const followers = await getFollowers(user.username);
  const following = await getFollowing(user.username);
  const followingMyself = await isFollowing(user.id);
  const { notifications, unreadCount } = await getNotifications();

  const results = [
    { api: "getCurrentUser", status: !!user, data: `id: ${user.id}` },
    { api: "createPost", status: newPost.success, data: newPost.success ? `id: ${newPost.data.id}` : newPost.error },
    { api: "getFeed", status: feedTotal >= 0, data: `${feedTotal} posts` },
    { api: "getUserPosts", status: Array.isArray(userPosts), data: `${userPosts.length} posts` },
    { api: "getPost", status: !!singlePost, data: singlePost ? `id: ${singlePost.id}` : "no posts yet" },
    { api: "getComments", status: Array.isArray(comments), data: `${comments.length} comments` },
    { api: "getSuggestedUsers", status: Array.isArray(suggested), data: `${suggested.length} users` },
    { api: "searchUsers", status: Array.isArray(searchResult), data: `${searchResult.length} results` },
    { api: "getUserByUsername", status: !!profile, data: `@${profile?.username}` },
    { api: "getFollowers", status: Array.isArray(followers), data: `${followers.length} followers` },
    { api: "getFollowing", status: Array.isArray(following), data: `${following.length} following` },
    { api: "isFollowing", status: true, data: `following self: ${followingMyself}` },
    { api: "getNotifications", status: true, data: `${notifications.length} notifications, ${unreadCount} unread` },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">API Test Results</h1>
      <p className="text-gray-500 mb-6">Logged in as: <strong>{user.username}</strong></p>
      <div className="space-y-2">
        {results.map((r) => (
          <div key={r.api} className="flex items-center justify-between p-3 rounded border">
            <div className="flex items-center gap-3">
              <span className={`text-lg ${r.status ? "text-green-500" : "text-red-500"}`}>
                {r.status ? "✅" : "❌"}
              </span>
              <span className="font-mono text-sm font-semibold">{r.api}()</span>
            </div>
            <span className="text-sm text-gray-500">{r.data}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-400">
          Note: toggleLike(), addComment(), toggleFollow(), markNotificationRead() need UI buttons to test.
        </p>
      </div>
    </div>
  );
}
