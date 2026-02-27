import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export function AnimatedStat({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2000,
  className
}: AnimatedStatProps) {
  const { formattedCount, elementRef } = useCountUp({
    end: value,
    suffix,
    prefix,
    duration
  });

  return (
    <div ref={elementRef} className={cn("space-y-2 text-center", className)}>
      <div className="text-2xl md:text-5xl font-bold">{formattedCount}</div>
      <div className="text-primary-foreground/80 text-xs md:text-base">{label}</div>
    </div>
  );
}
