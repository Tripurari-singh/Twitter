import { syncUser, getCurrentUser } from "@/actions/user.action";
import { getFeed } from "@/actions/post.action";

export default async function DashboardPage() {
  await syncUser();
  const user = await getCurrentUser();
  const { posts } = await getFeed();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Logged in as:</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Feed ({posts.length} posts):</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div>
    </div>
  );
}
