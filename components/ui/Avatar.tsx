import Image from "next/image";

export default function Avatar({ src, username, size = 40 }: { src?: string | null; username: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-white/10 overflow-hidden shrink-0 flex items-center justify-center border border-white/10"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={username} width={size} height={size} className="rounded-full object-cover" />
      ) : (
        <span className="text-white font-semibold" style={{ fontSize: size * 0.38 }}>
          {username[0].toUpperCase()}
        </span>
      )}
    </div>
  );
}
