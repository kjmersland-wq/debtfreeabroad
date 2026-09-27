import { locales, type Locale } from "@/i18n";
import { AppLink, type AppPath } from "@/lib/locale";

const labels: Record<Locale, string> = { en: "EN", no: "NO", pl: "PL", de: "DE" };

export function LocaleSwitch({ current, path }: { current: Locale; path: AppPath }) {
  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground">·</span>}
          <AppLink
            to={path}
            locale={l}
            className={
              l === current
                ? "text-forest underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {labels[l]}
          </AppLink>
        </span>
      ))}
    </nav>
  );
}
