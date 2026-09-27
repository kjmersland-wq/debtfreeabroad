import { useEffect, useRef, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import type { CalcResult } from "@/lib/calc";
import { baselines, type CountryCode, type DisplayCurrency } from "@/data/costBaselines";
import { AppLink, formatMoney, formatNumber } from "@/lib/locale";

function useCountUp(value: number, numberLocale: string) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 400);
      setShown(a + (b - a) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return formatNumber(Math.round(shown), numberLocale);
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5 rule-top first:border-t-0">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className={`num ${strong ? "text-lg text-foreground" : "text-base text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function Timeline({
  t,
  result,
  currency,
  numberLocale,
}: {
  t: Dict;
  result: CalcResult;
  currency: DisplayCurrency;
  numberLocale: string;
}) {
  const start = Math.max(
    result.home.payoff.balanceByMonth[0] ?? 0,
    result.abroad.payoff.balanceByMonth[0] ?? 0,
  );
  if (start <= 0) return null;

  const at = (arr: number[], year: number) => Math.max(0, arr[year * 12 - 1] ?? 0);

  return (
    <div className="mt-8">
      <h3 className="field-label">{t.result.timeline}</h3>
      <div className="mt-4 space-y-4">
        {[1, 2, 3, 4, 5].map((year) => {
          const h = at(result.home.payoff.balanceByMonth, year);
          const a = at(result.abroad.payoff.balanceByMonth, year);
          return (
            <div key={year}>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {t.result.year} {year}
                </span>
              </div>
              <div className="mt-1.5 space-y-1.5">
                {[
                  { label: t.result.home, v: h, cls: "bg-muted-foreground" },
                  { label: t.result.away, v: a, cls: "bg-foreground" },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-xs text-muted-foreground">
                      {bar.label}
                    </span>
                    <div className="h-2.5 flex-1 rounded-full bg-surface">
                      <div
                        className={`h-full rounded-full ${bar.cls} transition-[width] duration-200`}
                        style={{ width: `${Math.min(100, (bar.v / start) * 100)}%` }}
                      />
                    </div>
                    <span className="num w-28 shrink-0 text-right text-xs text-ink-soft">
                      {formatMoney(bar.v, currency, numberLocale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResultReceipt({
  t,
  locale,
  result,
  currency,
  hasDebts,
  from,
  to,
}: {
  t: Dict;
  locale: Locale;
  result: CalcResult;
  currency: DisplayCurrency;
  hasDebts: boolean;
  from: CountryCode;
  to: CountryCode;
}) {
  const numberLocale = t.numberLocale;
  const saved = useCountUp(Math.max(0, result.monthsSaved), numberLocale);

  const months = (n: number, never: boolean) =>
    never ? t.result.never : `${formatNumber(n, numberLocale)} ${t.result.months}`;

  const advice =
    result.monthsSaved <= 0
      ? t.result.advSlower
      : result.monthsSaved <= 12
        ? t.result.advSmall
        : t.result.advLarge;

  return (
    <section aria-live="polite">
      <p className="field-label">
        {t.result.title} — {baselines[from].name} → {baselines[to].name}
      </p>

      {!hasDebts ? (
        <p className="mt-6 text-base text-ink-soft">{t.result.noDebts}</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-3">
            <span className="num font-display text-[120px] leading-[0.85] font-semibold tracking-[-0.06em] text-foreground sm:text-[160px]">
              {result.monthsSaved > 0 ? saved : "0"}
            </span>
            <span className="text-sm text-ink-soft">
              {t.result.monthsSaved.toLowerCase()}
            </span>
            <span className="pill-secondary h-6 px-2.5 text-[11px] tracking-[0.12em] uppercase">
              {t.hero.chipPrivate}
            </span>
            <span className="pill-secondary h-6 px-2.5 text-[11px] tracking-[0.12em] uppercase">
              {t.hero.chipNoAi}
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-ink-soft">{advice}</p>

          <div className="mt-8">
            <Row
              label={t.result.atHome}
              value={months(result.home.payoff.months, result.home.payoff.neverPaidOff)}
              strong
            />
            <Row
              label={t.result.abroad}
              value={months(result.abroad.payoff.months, result.abroad.payoff.neverPaidOff)}
              strong
            />
            <Row
              label={t.result.surplusNow}
              value={formatMoney(result.home.surplus, currency, numberLocale)}
            />
            <Row
              label={t.result.surplusThere}
              value={formatMoney(result.abroad.surplus, currency, numberLocale)}
            />
            <Row
              label={t.result.freed}
              value={formatMoney(result.extraCashFreed, currency, numberLocale)}
            />
            <Row
              label={t.result.payback}
              value={
                Number.isFinite(result.moveCostMonths)
                  ? `${formatNumber(result.moveCostMonths, numberLocale)} ${t.result.months}`
                  : "—"
              }
            />
          </div>

          <Timeline t={t} result={result} currency={currency} numberLocale={numberLocale} />

          <div className="mt-8 rule-top pt-4">
            <h3 className="field-label">
              {t.result.inputsUsed}
            </h3>
            <dl className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
              <div className="flex justify-between gap-4">
                <dt>
                  {baselines[from].name} — {t.result.rent}
                </dt>
                <dd className="num">
                  {formatMoney(result.homeLiving.rent, currency, numberLocale)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  {baselines[to].name} — {t.result.rent}
                </dt>
                <dd className="num">
                  {formatMoney(result.abroadLiving.rent, currency, numberLocale)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  {baselines[from].name} — {t.result.other}
                </dt>
                <dd className="num">
                  {formatMoney(result.home.living - result.homeLiving.rent, currency, numberLocale)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  {baselines[to].name} — {t.result.other}
                </dt>
                <dd className="num">
                  {formatMoney(result.abroadLiving.other, currency, numberLocale)}
                </dd>
              </div>
            </dl>
          </div>
        </>
      )}

      <p className="mt-8 rule-top pt-5 font-display text-lg leading-snug text-foreground">
        {t.result.honest}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {t.result.disclaimer}{" "}
        <AppLink to="/method" locale={locale} className="text-foreground underline underline-offset-4">
          {t.result.methodLink}
        </AppLink>
      </p>
    </section>
  );
}
