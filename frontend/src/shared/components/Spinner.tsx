interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Spinner = ({ className = "", size = "md" }: SpinnerProps) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-[#1E3F20]/20 border-t-[#1E3F20] rounded-full animate-spin`}
        role="status"
      />
    </div>
  );
};
