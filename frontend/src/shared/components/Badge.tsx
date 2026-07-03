import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "success" | "info" | "warning" | "danger" | "neutral" | "primary";
}

export const Badge = ({ children, className = "", variant = "neutral" }: BadgeProps) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200";
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    info: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    neutral: "bg-slate-800/60 text-slate-300 border border-slate-700/50",
    primary: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
