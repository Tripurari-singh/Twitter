import { Sidebar } from "@/components/ui/Sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="sticky top-0 h-screen shrink-0 hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-1 min-h-screen border-l border-white/10">
        {children}
      </main>
    </div>
  );
}
