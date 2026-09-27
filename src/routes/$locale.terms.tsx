import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { TermsPage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "Terms — DebtFreeAbroad";
const description = "Estimates only. Not financial, tax or legal advice.";

export const Route = createFileRoute("/$locale/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocaleTerms,
});

function LocaleTerms() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/terms">
      <TermsPage t={t} />
    </SiteShell>
  );
}
