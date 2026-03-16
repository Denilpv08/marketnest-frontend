import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const Card = ({ children, className = "", padding = "md" }: CardProps) => {
  const paddings = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
