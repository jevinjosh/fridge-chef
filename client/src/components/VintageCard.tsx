import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface VintageCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function VintageCard({ children, className, title, subtitle }: VintageCardProps) {
  return (
    <div className={cn("paper-card relative overflow-hidden p-6 sm:p-8 md:p-10", className)}>
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/30" />

      {(title || subtitle) && (
        <div className="text-center mb-8 pb-4 border-b border-dashed border-primary/20">
          {title && (
            <h2 className="text-3xl sm:text-4xl text-primary mb-2 drop-shadow-sm">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="font-typewriter text-sm sm:text-base text-muted-foreground uppercase tracking-widest">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
