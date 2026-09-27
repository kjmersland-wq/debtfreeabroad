import type { Dict } from "@/i18n";
import type { Debt } from "@/lib/calc";

const FREE_ROWS = 3;

export function DebtRows({
  t,
  debts,
  currency,
  onChange,
}: {
  t: Dict;
  debts: Debt[];
  currency: string;
  onChange: (debts: Debt[]) => void;
}) {
  const update = (id: string, patch: Partial<Debt>) =>
    onChange(debts.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const add = () =>
    onChange([
      ...debts,
      {
        id: `d${Date.now()}`,
        name: `${t.form.debtName} ${debts.length + 1}`,
        balance: 0,
        apr: 0,
        minimum: 0,
        extra: 0,
      },
    ]);

  const remove = (id: string) => onChange(debts.filter((d) => d.id !== id));

  const num = (v: number) => (v === 0 ? "" : String(v));

  return (
    <fieldset className="mt-6">
      <legend className="field-label">
        {t.form.debts} ({currency})
      </legend>
      <div>
        <div>
          <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.9fr_0.9fr_1.75rem] gap-0.5 px-2 pb-1 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <span className="truncate px-1">{t.form.debtName}</span>
            <span className="truncate px-1 text-right">{t.form.balance}</span>
            <span className="truncate px-1 text-right">{t.form.apr}</span>
            <span className="truncate px-1 text-right">{t.form.minimum}</span>
            <span className="truncate px-1 text-right">{t.form.extra}</span>
            <span />
          </div>
          <div className="space-y-2">
            {debts.map((d, i) => (
              <div
                key={d.id}
                className="grid grid-cols-[1.6fr_1fr_0.7fr_0.9fr_0.9fr_1.75rem] items-center gap-0.5 rounded-full border border-border bg-surface-raised px-2"
              >
              <input
                aria-label={`${t.form.debtName} ${i + 1}`}
                className="h-10 w-full min-w-0 bg-transparent px-1 text-sm num outline-none focus-visible:rounded-full focus-visible:ring-1 focus-visible:ring-ring"
                value={d.name}
                onChange={(e) => update(d.id, { name: e.target.value })}
              />
              <input
                aria-label={`${t.form.balance} ${i + 1}`}
                type="number"
                inputMode="decimal"
                min={0}
                className="h-10 w-full min-w-0 bg-transparent px-1 text-sm num outline-none focus-visible:rounded-full focus-visible:ring-1 focus-visible:ring-ring text-right"
                value={num(d.balance)}
                onChange={(e) => update(d.id, { balance: Number(e.target.value) || 0 })}
              />
              <input
                aria-label={`${t.form.apr} ${i + 1}`}
                type="number"
                inputMode="decimal"
                min={0} step="0.1"
                className="h-10 w-full min-w-0 bg-transparent px-1 text-sm num outline-none focus-visible:rounded-full focus-visible:ring-1 focus-visible:ring-ring text-right"
                value={num(d.apr)}
                onChange={(e) => update(d.id, { apr: Number(e.target.value) || 0 })}
              />
              <input
                aria-label={`${t.form.minimum} ${i + 1}`}
                type="number"
                inputMode="decimal"
                min={0}
                className="h-10 w-full min-w-0 bg-transparent px-1 text-sm num outline-none focus-visible:rounded-full focus-visible:ring-1 focus-visible:ring-ring text-right"
                value={num(d.minimum)}
                onChange={(e) => update(d.id, { minimum: Number(e.target.value) || 0 })}
              />
              <input
                aria-label={`${t.form.extra} ${i + 1}`}
                type="number"
                inputMode="decimal"
                min={0}
                className="h-10 w-full min-w-0 bg-transparent px-1 text-sm num outline-none focus-visible:rounded-full focus-visible:ring-1 focus-visible:ring-ring text-right"
                value={num(d.extra)}
                onChange={(e) => update(d.id, { extra: Number(e.target.value) || 0 })}
              />
              <button
                type="button"
                onClick={() => remove(d.id)}
                disabled={debts.length === 1}
                aria-label={`${t.form.removeDebt} ${i + 1}`}
                title={t.form.removeDebt}
                className="size-7 rounded-full text-muted-foreground transition-opacity duration-[180ms] hover:opacity-60 disabled:opacity-30"
              >
                ×
              </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={add}
          disabled={debts.length >= FREE_ROWS}
          className="pill-secondary h-9 px-4 text-sm disabled:opacity-40"
        >
          {t.form.addDebt}
        </button>
        <p className="text-xs text-muted-foreground">{t.form.freeLimit}</p>
      </div>
    </fieldset>
  );
}
