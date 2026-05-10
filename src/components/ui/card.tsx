import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl",
      elevated: "bg-white/15 backdrop-blur-2xl border border-white/20 shadow-2xl",
      glass: "glass",
      bordered: "bg-transparent border-2 border-white/15",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-7",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-xl)]",
          variants[variant],
          paddings[padding],
          hover &&
            "transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
