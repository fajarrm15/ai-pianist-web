import React from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  glow?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-violet-600 to-violet-500
    hover:from-violet-500 hover:to-violet-400
    text-white shadow-lg shadow-violet-500/25
    hover:shadow-violet-500/40
  `,
  secondary: `
    glass glass-hover
    text-white hover:border-white/20
  `,
  ghost: `
    bg-transparent hover:bg-white/5
    text-gray-300 hover:text-white
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-red-500
    hover:from-red-500 hover:to-red-400
    text-white shadow-lg shadow-red-500/25
  `,
  success: `
    bg-gradient-to-r from-emerald-600 to-emerald-500
    hover:from-emerald-500 hover:to-emerald-400
    text-white shadow-lg shadow-emerald-500/25
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3.5 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  glow = false,
  className = "",
  disabled,
  children,
  ...props
}: Props) {
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-xl font-medium
    transition-all duration-300 ease-out
    focus:outline-none focus-ring
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    active:scale-[0.98]
  `;

  const glowStyle = glow && variant === "primary" ? "glow-primary" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

// Icon-only button variant
export function IconButton({
  icon: Icon,
  size = "md",
  variant = "ghost",
  className = "",
  ...props
}: Omit<Props, "children" | "iconPosition"> & { icon: LucideIcon }) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      className={`
        ${sizeMap[size]}
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-300 ease-out
        focus:outline-none focus-ring
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      <Icon className={iconSizeMap[size]} />
    </button>
  );
}
