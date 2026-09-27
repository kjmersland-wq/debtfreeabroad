import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { PrivacyPage } from "@/components/pages";

const title = "Privacy — DebtFreeAbroad";
const description = "Your figures stay in your browser. No accounts, no trackers.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const t = getDict("en");
  return (
    <SiteShell locale="en" t={t} path="/privacy">
      <PrivacyPage t={t} />
    </SiteShell>
  );
}
