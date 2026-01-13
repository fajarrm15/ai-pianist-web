import Link from "next/link";
import { useRouter } from "next/router";
import { Piano, MessageSquare, Music, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const tabs: Tab[] = [
  { href: "/companion", label: "Coach", icon: MessageSquare },
  { href: "/piano", label: "Piano", icon: Music },
  { href: "/playlist", label: "Playlist", icon: Sparkles },
];

export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Piano className="w-5 h-5 text-violet-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">AI Pianist</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Companion</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 glass rounded-full p-1.5">
          {tabs.map((tab) => {
            const active = router.pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-300 ease-out
                  ${active
                    ? "bg-white text-gray-900 shadow-lg shadow-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${active ? "text-violet-600" : ""}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer for balance */}
        <div className="w-[140px] hidden md:block" />
      </div>
    </header>
  );
}
