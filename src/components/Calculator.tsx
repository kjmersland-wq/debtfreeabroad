import { useEffect, useMemo, useState } from "react";
import type { Dict, Locale } from "@/i18n";
import {
  destinationCountries,
  displayCurrencies,
  displayRates,
  originCountries,
  type CountryCode,
  type DisplayCurrency,
} from "@/data/costBaselines";
import { calculate, type CalcResult, type CityTier, type Debt, type Household, type HousingMode } from "@/lib/calc";
import { CountrySelect } from "./CountrySelect";
import { DebtRows } from "./DebtRows";
import { ResultReceipt } from "./ResultReceipt";

type State = {
  from: CountryCode;
  to: CountryCode;
  household: Household;
  children: number;
  netIncome: number;
  currentCosts: number | null;
  cityTier: CityTier;
  housing: HousingMode;
  keepIncome: boolean;
  moveCost: number;
  currency: DisplayCurrency;
  debts: Debt[];
};

// Hardcoded starting example: Norway -> Poland, remote income, two debts.
const defaultState: State = {
  from: "NO",
  to: "PL",
  household: "single",
  children: 0,
  netIncome: 3800,
  currentCosts: null,
  cityTier: "capital",
  housing: "rent1",
  keepIncome: true,
  moveCost: 4000,
  currency: "EUR",
  debts: [
    { id: "d1", name: "Car loan", balance: 14000, apr: 7.5, minimum: 320, extra: 0 },
    { id: "d2", name: "Consumer loan", balance: 9000, apr: 16.9, minimum: 240, extra: 100 },
  ],
};

const STORAGE_KEY = "dfa.plan.v1";

function encode(s: State) {
  const params = new URLSearchParams();
  params.set("f", s.from);
  params.set("t", s.to);
  params.set("h", s.household);
  params.set("c", String(s.children));
  params.set("i", String(s.netIncome));
  if (s.currentCosts !== null) params.set("lc", String(s.currentCosts));
  params.set("ct", s.cityTier);
  params.set("ho", s.housing);
  params.set("ki", s.keepIncome ? "1" : "0");
  params.set("mc", String(s.moveCost));
  params.set("cur", s.currency);
  params.set(
    "d",
    s.debts.map((d) => [d.name, d.balance, d.apr, d.minimum, d.extra].join("~")).join("|"),
  );
  return params.toString();
}

function decode(search: string, base: State): State {
  const p = new URLSearchParams(search);
  if (![...p.keys()].length) return base;
  const numOr = (key: string, fallback: number) => {
    const v = p.get(key);
    const n = v === null ? NaN : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const debtsRaw = p.get("d");
  const debts: Debt[] = debtsRaw
    ? debtsRaw.split("|").map((row, i) => {
        const [name, balance, apr, minimum, extra] = row.split("~");
        return {
          id: `u${i}`,
          name: name || `Debt ${i + 1}`,
          balance: Number(balance) || 0,
          apr: Number(apr) || 0,
          minimum: Number(minimum) || 0,
          extra: Number(extra) || 0,
        };
      })
    : base.debts;

  return {
    ...base,
    from: (p.get("f") as CountryCode) || base.from,
    to: (p.get("t") as CountryCode) || base.to,
    household: (p.get("h") as Household) || base.household,
    children: numOr("c", base.children),
    netIncome: numOr("i", base.netIncome),
    currentCosts: p.get("lc") !== null ? numOr("lc", 0) : base.currentCosts,
    cityTier: (p.get("ct") as CityTier) || base.cityTier,
    housing: (p.get("ho") as HousingMode) || base.housing,
    keepIncome: p.get("ki") !== "0",
    moveCost: numOr("mc", base.moveCost),
    currency: (p.get("cur") as DisplayCurrency) || base.currency,
    debts: debts.slice(0, 3),
  };
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`h-9 rounded-full border px-4 text-sm transition-all duration-[180ms] ${
              value === o.value
                ? "border-copper-deep bg-copper-deep text-primary-foreground"
                : "border-border-strong text-foreground hover:border-copper hover:text-copper-deep"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export type PlanState = {
  s: State;
  set: <K extends keyof State>(key: K, value: State[K]) => void;
  result: CalcResult;
  hasDebts: boolean;
};

export function usePlanState(): PlanState {
  const [s, setS] = useState<State>(defaultState);
  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  // Restore from URL first, then localStorage. Client-only to keep SSR stable.
  useEffect(() => {
    if (window.location.search.length > 1) {
      setS(decode(window.location.search, defaultState));
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setS({ ...defaultState, ...(JSON.parse(stored) as State) });
      } catch {
        /* ignore malformed storage */
      }
    }
  }, []);

  useEffect(() => {
    const qs = encode(s);
    window.history.replaceState(null, "", `${window.location.pathname}?${qs}`);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, [s]);

  const rate = displayRates[s.currency] ?? 1;
  const toEur = (v: number) => v / rate;

  const result = useMemo(
    () =>
      calculate({
        from: s.from,
        to: s.to,
        household: s.household,
        children: s.children,
        netIncome: toEur(s.netIncome),
        currentCosts: s.currentCosts === null ? null : toEur(s.currentCosts),
        debts: s.debts.map((d) => ({
          ...d,
          balance: toEur(d.balance),
          minimum: toEur(d.minimum),
          extra: toEur(d.extra),
        })),
        cityTier: s.cityTier,
        housing: s.housing,
        keepIncome: s.keepIncome,
        moveCost: toEur(s.moveCost),
      }),
    [s],
  );

  const hasDebts = s.debts.some((d) => d.balance > 0);

  return { s, set, result, hasDebts };
}

export function Calculator({ t, locale, plan }: { t: Dict; locale: Locale; plan: PlanState }) {
  const { s, set, result, hasDebts } = plan;

  return (
    <div id="calculator" className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <form
        className="order-2 lg:sticky lg:top-20 lg:self-start lg:border-l lg:border-border lg:pl-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="field-label font-sans tracking-[0.12em]">
          {t.form.from}
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <CountrySelect
            id="from-country"
            label={t.form.currentCountry}
            value={s.from}
            options={originCountries}
            onChange={(v) => set("from", v)}
          />
          <div>
            <label htmlFor="currency" className="field-label">
              {t.form.currency}
            </label>
            <select
              id="currency"
              className="field-input"
              value={s.currency}
              onChange={(e) => set("currency", e.target.value as DisplayCurrency)}
            >
              {displayCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Segmented
            label={t.form.household}
            value={s.household}
            onChange={(v) => set("household", v)}
            options={[
              { value: "single" as Household, label: t.form.single },
              { value: "couple" as Household, label: t.form.couple },
              { value: "family" as Household, label: t.form.family },
            ]}
          />
        </div>

        {s.household === "family" && (
          <div className="mt-4">
            <label htmlFor="children" className="field-label">
              {t.form.children}
            </label>
            <input
              id="children"
              type="number"
              min={0}
              max={3}
              className="field-input"
              value={s.children}
              onChange={(e) =>
                set("children", Math.max(0, Math.min(3, Number(e.target.value) || 0)))
              }
            />
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="income" className="field-label">
              {t.form.netIncome} ({s.currency})
            </label>
            <input
              id="income"
              type="number"
              min={0}
              inputMode="decimal"
              className="field-input"
              value={s.netIncome === 0 ? "" : s.netIncome}
              onChange={(e) => set("netIncome", Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label htmlFor="costs" className="field-label">
              {t.form.currentCosts} ({s.currency})
            </label>
            <input
              id="costs"
              type="number"
              min={0}
              inputMode="decimal"
              className="field-input"
              value={s.currentCosts === null ? "" : s.currentCosts}
              onChange={(e) =>
                set("currentCosts", e.target.value === "" ? null : Number(e.target.value) || 0)
              }
              aria-describedby="costs-hint"
            />
            <p id="costs-hint" className="mt-1 text-xs text-muted-foreground">
              {t.form.currentCostsHint}
            </p>
          </div>
        </div>

        <DebtRows t={t} debts={s.debts} currency={s.currency} onChange={(d) => set("debts", d)} />

        <h2 className="mt-8 field-label font-sans">
          {t.form.to}
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <CountrySelect
            id="to-country"
            label={t.form.destination}
            value={s.to}
            options={destinationCountries}
            onChange={(v) => set("to", v)}
          />
          <div>
            <label htmlFor="housing" className="field-label">
              {t.form.housing}
            </label>
            <select
              id="housing"
              className="field-input"
              value={s.housing}
              onChange={(e) => set("housing", e.target.value as HousingMode)}
            >
              <option value="rent1">{t.form.rent1}</option>
              <option value="rent2">{t.form.rent2}</option>
              <option value="buyLater">{t.form.buyLater}</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Segmented
            label={t.form.cityTier}
            value={s.cityTier}
            onChange={(v) => set("cityTier", v)}
            options={[
              { value: "capital" as CityTier, label: t.form.capital },
              { value: "second" as CityTier, label: t.form.second },
              { value: "smaller" as CityTier, label: t.form.smaller },
            ]}
          />
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            id="keep-income"
            type="checkbox"
            className="mt-1 size-4 accent-[var(--copper)]"
            checked={s.keepIncome}
            onChange={(e) => set("keepIncome", e.target.checked)}
          />
          <label htmlFor="keep-income" className="text-sm text-foreground">
            {t.form.keepIncome}
            <span className="mt-1 block text-xs text-muted-foreground">
              {s.keepIncome ? t.form.keepIncomeOn : t.form.keepIncomeOff}
            </span>
          </label>
        </div>

        <h2 className="mt-8 field-label font-sans">
          {t.form.assumptions}
        </h2>
        <div className="mt-3">
          <label htmlFor="movecost" className="field-label">
            {t.form.moveCost} ({s.currency})
          </label>
          <input
            id="movecost"
            type="number"
            min={0}
            inputMode="decimal"
            className="field-input"
            value={s.moveCost === 0 ? "" : s.moveCost}
            onChange={(e) => set("moveCost", Number(e.target.value) || 0)}
          />
        </div>

        <a
          href="#result"
          className="pill-primary mt-6 w-full lg:hidden"
        >
          {t.result.title}
        </a>
      </form>

      <div id="result" className="order-1 scroll-mt-20">
        <ResultReceipt
          t={t}
          locale={locale}
          result={result}
          currency={s.currency}
          hasDebts={hasDebts}
          from={s.from}
          to={s.to}
        />
      </div>
    </div>
  );
}
