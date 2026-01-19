import { ReactNode } from "react";

// ============== ICON AVATAR ==============
interface IconAvatarProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconAvatar({
  children,
  size = "md",
  className = "",
}: IconAvatarProps) {
  const sizeClasses = {
    sm: "w-9 h-9 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-11 h-11 rounded-2xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
