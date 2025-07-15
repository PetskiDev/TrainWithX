import { Button } from "@/components/ui/button";
import { goPublic } from "@frontend/lib/nav";
import type { FC } from "react";

interface BecomeCreatorProps {
  className?: string;
}

export const BecomeCreatorSection: FC<BecomeCreatorProps> = ({ className = "" }) => {
  return (
    <div className={`text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-12 mb-16 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
        Are You a Fitness Professional?
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        Share your expertise and earn money by creating training plans for our community
      </p>
      <Button
        size="lg"
        variant="outline"
        className="px-8 py-4 text-lg border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg"
        onClick={() => goPublic("/become-creator")}
      >
        Become a Creator
      </Button>
    </div>
  );
};

export default BecomeCreatorSection;
