import { Button } from "@/components/ui/button";
import { goPublic } from '@frontend/lib/nav';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
      <p className="text-muted-foreground text-lg mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <Button variant="outline" onClick={() => goPublic("/")}>
        Go back home
      </Button>
    </div>
  );
}
