import PostComposer from "@/components/ui/PostComposer";
import PostFeed from "@/components/ui/PostFeed";

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <PostComposer />
      <div className="h-px bg-white/10" />
      <PostFeed />
    </div>
  );
}
