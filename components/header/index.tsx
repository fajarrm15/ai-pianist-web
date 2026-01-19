import Link from "next/link";
import { ReactNode } from "react";

// ============== HEADER ==============
interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
  rightContent?: ReactNode;
}

export function Header({
  title,
  subtitle,
  icon,
  showBackButton = true,
  rightContent,
}: HeaderProps) {
  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-mint-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {showBackButton ? (
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-400 hover:text-mint-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
        ) : (
          <div className="w-16" />
        )}

        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-md">
              {icon}
            </div>
          )}
          <div>
            <h1 className="font-display font-semibold text-stone-800">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-mint-600">{subtitle}</p>}
          </div>
        </div>

        {rightContent || <div className="w-16" />}
      </div>
    </header>
  );
}
