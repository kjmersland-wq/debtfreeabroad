import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { HomePage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "DebtFreeAbroad — Moving does not erase debt. Cheaper rent can.";
const description =
  "Estimate how much faster you reach zero debt if living costs drop. Plain arithmetic, private in your browser.";

export const Route = createFileRoute("/$locale/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocaleHome,
});

function LocaleHome() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/">
      <HomePage t={t} locale={locale} />
    </SiteShell>
  );
}
