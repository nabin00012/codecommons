'use client';

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-destructive">500</h1>
            <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            <Button onClick={reset} className="mt-6">
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
