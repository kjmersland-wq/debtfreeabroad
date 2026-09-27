import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PricingPage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "Pricing — DebtFreeAbroad";
const description = "Free calculator with three debt rows. Pro is waitlist only.";

export const Route = createFileRoute("/$locale/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocalePricing,
});

function LocalePricing() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/pricing">
      <PricingPage t={t} />
    </SiteShell>
  );
}
