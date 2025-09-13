"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 rounded-full border border-primary/50 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-3 py-1 text-sm transition-colors",
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-primary/20"
        )}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("hi")}
        className={cn(
          "rounded-full px-3 py-1 text-sm transition-colors",
          language === "hi"
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-primary/20"
        )}
      >
        HI
      </Button>
    </div>
  );
}
