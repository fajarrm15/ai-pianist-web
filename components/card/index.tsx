import { ReactNode } from "react";

// ============== CARD ==============
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-white border border-mint-100 rounded-2xl shadow-sm ${
        hover ? "hover:shadow-md hover:border-mint-200 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
