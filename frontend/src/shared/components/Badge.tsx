import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "success" | "info" | "warning" | "danger" | "neutral" | "primary";
}

export const Badge = ({ children, className = "", variant = "neutral" }: BadgeProps) => {
  const baseStyle = "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border rounded-none";
  const variants = {
    success: "bg-[#E2F0D9] text-[#385723] border-[#C5E0B4]",
    info: "bg-[#DDEBF7] text-[#1F4E79] border-[#BDD7EE]",
    warning: "bg-[#FFF2CC] text-[#7F6000] border-[#FFE699]",
    danger: "bg-[#FCE4D6] text-[#C65911] border-[#F8CBAD]",
    neutral: "bg-[#F2F2F2] text-[#595959] border-[#D9D9D9]",
    primary: "bg-[#E8F1E9] text-[#1E3F20] border-[#D2E2D4]", // Forest Green themed
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
