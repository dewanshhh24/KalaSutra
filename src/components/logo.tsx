import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export function Logo({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={cn("font-headline text-3xl tracking-tight text-primary", className)}>
      {t('appName')}
    </div>
  );
}
