import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { MethodPage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "Method — how DebtFreeAbroad estimates";
const description =
  "The amortization loop, the 2026 cost baseline, and everything the model leaves out.";

export const Route = createFileRoute("/$locale/method")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocaleMethod,
});

function LocaleMethod() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/method">
      <MethodPage t={t} />
    </SiteShell>
  );
}
