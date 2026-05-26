import ProfileHeader from "@/components/ui/ProfileHeader";
import UserPostFeed from "@/components/ui/UserPostFeed";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <ProfileHeader username={username} />
      <div className="h-px bg-white/10" />
      <UserPostFeed username={username} />
    </div>
  );
}
