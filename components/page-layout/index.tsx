import Link from "next/link";
import { ReactNode } from "react";

// ============== PAGE LAYOUT ==============
interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-stone-50 via-mint-50/30 to-stone-50 ${className}`}
    >
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-mint-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-mint-100/20 rounded-full blur-3xl" />
      </div>
      {children}
    </div>
  );
}
