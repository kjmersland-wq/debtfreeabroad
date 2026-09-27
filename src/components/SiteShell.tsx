import type { ReactNode } from "react";
import type { Dict, Locale } from "@/i18n";
import { AppLink, type AppPath } from "@/lib/locale";
import { LocaleSwitch } from "./LocaleSwitch";

function Nav({ locale, t, path }: { locale: Locale; t: Dict; path: AppPath }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-(--container-content) items-center justify-between px-5">
        <AppLink to="/" locale={locale} className="font-display text-lg font-semibold tracking-[-0.04em]">
          DebtFree<span className="text-muted-foreground">Abroad</span>
        </AppLink>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm text-ink-soft sm:flex">
            <AppLink to="/method" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.nav.method}
            </AppLink>
            <AppLink to="/pricing" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.nav.pricing}
            </AppLink>
          </nav>
          <LocaleSwitch current={locale} path={path} />
          <AppLink to="/plan" locale={locale} className="pill-primary h-9 px-4">
            {t.nav.plan}
          </AppLink>
        </div>
      </div>
    </header>
  );
}

function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto w-full max-w-(--container-content) px-5 py-10 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-foreground">
            <span className="font-display text-2xl font-semibold tracking-[-0.04em]">DebtFreeAbroad</span>
            <span className="ml-3 text-muted-foreground">{t.footer.brand}</span>
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <AppLink to="/method" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.nav.method}
            </AppLink>
            <AppLink to="/pricing" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.nav.pricing}
            </AppLink>
            <AppLink to="/privacy" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.footer.privacy}
            </AppLink>
            <AppLink to="/terms" locale={locale} className="transition-opacity duration-[180ms] hover:opacity-60">
              {t.footer.terms}
            </AppLink>
            <LocaleSwitch current={locale} path="/" />
          </div>
        </div>
        <p className="mt-6 max-w-2xl">{t.footer.privacyNote}</p>
        <p className="mt-2 max-w-2xl">{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}

export function SiteShell({
  locale,
  t,
  path,
  children,
}: {
  locale: Locale;
  t: Dict;
  path: AppPath;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Nav locale={locale} t={t} path={path} />
      <main className="mx-auto w-full max-w-(--container-content) px-5">{children}</main>
      <Footer locale={locale} t={t} />
    </div>
  );
}
