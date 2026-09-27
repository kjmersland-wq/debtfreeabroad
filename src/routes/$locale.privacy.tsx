import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PrivacyPage } from "@/components/pages";
import { useLocale } from "@/lib/locale";

const title = "Privacy — DebtFreeAbroad";
const description = "Your figures stay in your browser. No accounts, no trackers.";

export const Route = createFileRoute("/$locale/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LocalePrivacy,
});

function LocalePrivacy() {
  const { locale, t } = useLocale();
  return (
    <SiteShell locale={locale} t={t} path="/privacy">
      <PrivacyPage t={t} />
    </SiteShell>
  );
}
