import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "elevated" | "flat";
}

export const Card = ({ children, className = "", variant = "glass" }: CardProps) => {
  const baseStyle = "rounded-2xl p-6 transition-all duration-300";
  const variants = {
    glass: "bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
    elevated: "bg-slate-900 border border-slate-800/50 shadow-md hover:shadow-lg hover:border-slate-700/50",
    flat: "bg-slate-950 border border-slate-900",
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
