import { ReactNode } from "react";

// ============== BADGE ==============
interface BadgeProps {
  children: ReactNode;
  pulse?: boolean;
}

export function Badge({ children, pulse = true }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-mint-100 rounded-full">
      {pulse && (
        <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
      )}
      <span className="text-sm font-medium text-mint-700">{children}</span>
    </div>
  );
}
