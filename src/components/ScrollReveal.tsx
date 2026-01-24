import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 600
}: ScrollRevealProps) {
  const { isVisible, elementRef } = useScrollAnimation({ threshold: 0.1 });

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`
    };

    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return { ...baseStyles, opacity: 0, transform: "translateY(40px)" };
        case "fade-down":
          return { ...baseStyles, opacity: 0, transform: "translateY(-40px)" };
        case "fade-left":
          return { ...baseStyles, opacity: 0, transform: "translateX(-40px)" };
        case "fade-right":
          return { ...baseStyles, opacity: 0, transform: "translateX(40px)" };
        case "scale":
          return { ...baseStyles, opacity: 0, transform: "scale(0.9)" };
        case "fade":
        default:
          return { ...baseStyles, opacity: 0 };
      }
    }

    return { ...baseStyles, opacity: 1, transform: "none" };
  };

  return (
    <div ref={elementRef} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
}
