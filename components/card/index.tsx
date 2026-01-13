import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

type CardColor = "violet" | "blue" | "emerald" | "pink" | "amber" | "neutral";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: CardColor;
}

const colorStyles: Record<CardColor, { bg: string; text: string; glow: string }> = {
  violet: {
    bg: "from-violet-500/20 to-violet-600/10",
    text: "text-violet-400 group-hover:text-violet-300",
    glow: "group-hover:shadow-violet-500/20",
  },
  blue: {
    bg: "from-blue-500/20 to-blue-600/10",
    text: "text-blue-400 group-hover:text-blue-300",
    glow: "group-hover:shadow-blue-500/20",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    text: "text-emerald-400 group-hover:text-emerald-300",
    glow: "group-hover:shadow-emerald-500/20",
  },
  pink: {
    bg: "from-pink-500/20 to-pink-600/10",
    text: "text-pink-400 group-hover:text-pink-300",
    glow: "group-hover:shadow-pink-500/20",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    text: "text-amber-400 group-hover:text-amber-300",
    glow: "group-hover:shadow-amber-500/20",
  },
  neutral: {
    bg: "from-white/10 to-white/5",
    text: "text-gray-400 group-hover:text-gray-300",
    glow: "group-hover:shadow-white/10",
  },
};

export function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
  color = "violet",
}: FeatureCardProps) {
  const styles = colorStyles[color];

  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden
        rounded-2xl p-6
        glass glass-hover
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        shadow-lg shadow-black/20 ${styles.glow} hover:shadow-xl
      `}
    >
      {/* Gradient overlay */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${styles.bg}
          transition-opacity duration-500
        `}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={`
            w-12 h-12 rounded-xl mb-4
            bg-gradient-to-br ${styles.bg}
            flex items-center justify-center
            transition-transform duration-300
            group-hover:scale-110
          `}
        >
          <Icon className={`w-6 h-6 ${styles.text} transition-colors duration-300`} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          {title}
          <ArrowRight
            className={`
              w-4 h-4 opacity-0 -translate-x-2
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-300
              ${styles.text}
            `}
          />
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

// Simple card for general content
interface CardProps {
  title: string;
  desc: string;
  href: string;
}

export function Card({ title, desc, href }: CardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl glass glass-hover p-5 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-white">{title}</div>
        <ArrowRight className="w-4 h-4 text-gray-400 transition group-hover:text-white group-hover:translate-x-1" />
      </div>
      <div className="mt-2 text-sm leading-relaxed text-gray-400">{desc}</div>
    </Link>
  );
}

// Glass panel for containing content
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function GlassPanel({ children, className = "", padding = "md" }: GlassPanelProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`glass rounded-2xl ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}
