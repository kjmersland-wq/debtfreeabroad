import { createFileRoute } from "@tanstack/react-router";
import { getDict } from "@/i18n";
import { SiteShell } from "@/components/SiteShell";
import { MethodPage } from "@/components/pages";

const title = "Method — how DebtFreeAbroad estimates";
const description =
  "The amortization loop, the 2026 cost baseline, and everything the model leaves out.";

export const Route = createFileRoute("/method")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Method,
});

function Method() {
  const t = getDict("en");
  return (
    <SiteShell locale="en" t={t} path="/method">
      <MethodPage t={t} />
    </SiteShell>
  );
}
