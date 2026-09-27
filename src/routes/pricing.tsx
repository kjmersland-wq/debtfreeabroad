import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { PricingPage } from "@/components/pages";

const title = "Pricing — DebtFreeAbroad";
const description = "Free calculator with three debt rows. Pro is waitlist only.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const t = getDict("en");
  return (
    <SiteShell locale="en" t={t} path="/pricing">
      <PricingPage t={t} />
    </SiteShell>
  );
}
