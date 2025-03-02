
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "group relative p-6 rounded-xl card-hover glass-panel flex flex-col gap-2",
        className
      )}
    >
      <div className="mb-2 text-primary">{icon}</div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
