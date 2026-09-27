import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { TermsPage } from "@/components/pages";

const title = "Terms — DebtFreeAbroad";
const description = "Estimates only. Not financial, tax or legal advice.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Terms,
});

function Terms() {
  const t = getDict("en");
  return (
    <SiteShell locale="en" t={t} path="/terms">
      <TermsPage t={t} />
    </SiteShell>
  );
}
