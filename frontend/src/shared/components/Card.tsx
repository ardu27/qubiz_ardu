import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "elevated" | "flat";
}

export const Card = ({ children, className = "", variant = "glass" }: CardProps) => {
  const baseStyle = "p-8 transition-all duration-200 border rounded-none";
  const variants = {
    glass: "bg-[#F6F3EB] border-[#E7E5E4] shadow-xs",
    elevated: "bg-white border-[#E7E5E4] shadow-sm hover:shadow-md",
    flat: "bg-[#FCFAF6] border-[#E7E5E4]",
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
