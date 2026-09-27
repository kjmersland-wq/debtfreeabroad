import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { PlanPage } from "@/components/pages";

const title = "Debt payoff calculator — DebtFreeAbroad";
const description =
  "Type income, living costs and balances. See months to debt-free at home versus after a move.";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Plan,
});

function Plan() {
  const t = getDict("en");
  return (
    <SiteShell locale="en" t={t} path="/plan">
      <PlanPage t={t} locale="en" />
    </SiteShell>
  );
}
