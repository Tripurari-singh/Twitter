import { getUserByUsername, getCurrentUser } from "@/actions/user.action";
import { isFollowing } from "@/actions/follow.action";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";

export default async function ProfileHeader({ username }: { username: string }) {
  const [profile, currentUser] = await Promise.all([
    getUserByUsername(username),
    getCurrentUser(),
  ]);

  if (!profile) {
    return <div className="p-8 text-center text-white/30 border border-white/10 rounded-2xl">User not found.</div>;
  }

  const isMe = currentUser?.id === profile.id;
  const following = !isMe ? await isFollowing(profile.id) : false;

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-black">
      <div className="h-32 bg-gradient-to-br from-sky-500/20 via-white/5 to-black border-b border-white/10" />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="ring-4 ring-black rounded-full">
            <Avatar src={profile.image} username={profile.username} size={72} />
          </div>
          {isMe ? (
            <button className="border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors">
              Edit Profile
            </button>
          ) : (
            <FollowButton targetUserId={profile.id} initialFollowing={following} />
          )}
        </div>

        <div className="mb-3">
          <h2 className="text-white font-bold text-lg">{profile.name ?? profile.username}</h2>
          <p className="text-white/40 text-sm">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-white/70 text-sm mb-3 leading-relaxed">{profile.bio}</p>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          {profile.location && (
            <span className="flex items-center gap-1 text-white/40 text-xs">
              <MapPin size={12} /> {profile.location}
            </span>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-400 text-xs hover:underline">
              <LinkIcon size={12} /> {profile.website}
            </a>
          )}
          <span className="flex items-center gap-1 text-white/40 text-xs">
            <Calendar size={12} /> Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>

        <div className="flex gap-6 border-t border-white/10 pt-4">
          <div>
            <p className="text-white font-bold text-sm">{profile._count.posts}</p>
            <p className="text-white/40 text-xs">Posts</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm">{profile._count.followers}</p>
            <p className="text-white/40 text-xs">Followers</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm">{profile._count.following}</p>
            <p className="text-white/40 text-xs">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}
