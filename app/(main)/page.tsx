import NoPrefetchLink from "@/components/NoPrefetchLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Button asChild variant="link">
          <NoPrefetchLink href="/auth">
            <LogInIcon /> Einloggen
          </NoPrefetchLink>
        </Button>
        <ThemeToggle />
      </div>
    </main>
  );
}
