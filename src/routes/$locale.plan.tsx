import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PlanPage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "Debt payoff calculator — DebtFreeAbroad";
const description =
  "Type income, living costs and balances. See months to debt-free at home versus after a move.";

export const Route = createFileRoute("/$locale/plan")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocalePlan,
});

function LocalePlan() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/plan">
      <PlanPage t={t} locale={locale} />
    </SiteShell>
  );
}
