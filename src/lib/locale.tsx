import { Link, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { getDict, isLocale, type Dict, type Locale } from "@/i18n";
import { displayRates, type DisplayCurrency } from "@/data/costBaselines";

export function useLocale(): { locale: Locale; t: Dict } {
  const params = useParams({ strict: false }) as { locale?: string };
  const raw = params.locale;
  const locale: Locale = raw && isLocale(raw) ? raw : "en";
  return { locale, t: getDict(locale) };
}

export type AppPath = "/" | "/plan" | "/method" | "/pricing" | "/privacy" | "/terms";

export function AppLink({
  to,
  locale,
  className,
  children,
}: {
  to: AppPath;
  locale: Locale;
  className?: string;
  children: ReactNode;
}) {
  if (locale === "en") {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  const localeTo = to === "/" ? "/$locale" : (`/$locale${to}` as const);
  return (
    <Link to={localeTo} params={{ locale }} className={className}>
      {children}
    </Link>
  );
}

export function formatMoney(
  amountEur: number,
  currency: DisplayCurrency,
  numberLocale: string,
  fractionDigits = 0,
) {
  const value = amountEur * (displayRates[currency] ?? 1);
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, numberLocale: string, fractionDigits = 0) {
  return new Intl.NumberFormat(numberLocale, {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
