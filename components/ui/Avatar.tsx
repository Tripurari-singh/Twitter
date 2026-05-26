import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: number;
}

export default function Avatar({ src, username, size = 40 }: AvatarProps) {
  return (
    <div
      className="rounded-full bg-white/10 overflow-hidden shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={username}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      ) : (
        <span className="text-white font-medium" style={{ fontSize: size * 0.35 }}>
          {username[0].toUpperCase()}
        </span>
      )}
    </div>
  );
}
