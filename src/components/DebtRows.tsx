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
      <div className="space-y-3">
        {debts.map((d, i) => (
          <div key={d.id} className="rounded-md border border-border bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <input
                aria-label={`${t.form.debtName} ${i + 1}`}
                className="field-input"
                value={d.name}
                onChange={(e) => update(d.id, { name: e.target.value })}
              />
              <button
                type="button"
                onClick={() => remove(d.id)}
                disabled={debts.length === 1}
                className="shrink-0 rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                {t.form.removeDebt}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label htmlFor={`${d.id}-bal`} className="field-label">
                  {t.form.balance}
                </label>
                <input
                  id={`${d.id}-bal`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="field-input"
                  value={num(d.balance)}
                  onChange={(e) => update(d.id, { balance: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor={`${d.id}-apr`} className="field-label">
                  {t.form.apr}
                </label>
                <input
                  id={`${d.id}-apr`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.1"
                  className="field-input"
                  value={num(d.apr)}
                  onChange={(e) => update(d.id, { apr: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor={`${d.id}-min`} className="field-label">
                  {t.form.minimum}
                </label>
                <input
                  id={`${d.id}-min`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="field-input"
                  value={num(d.minimum)}
                  onChange={(e) => update(d.id, { minimum: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label htmlFor={`${d.id}-extra`} className="field-label">
                  {t.form.extra}
                </label>
                <input
                  id={`${d.id}-extra`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="field-input"
                  value={num(d.extra)}
                  onChange={(e) => update(d.id, { extra: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={add}
          disabled={debts.length >= FREE_ROWS}
          className="rounded-sm border border-border-strong px-3 py-1.5 text-sm text-foreground hover:bg-accent disabled:opacity-40"
        >
          {t.form.addDebt}
        </button>
        <p className="text-xs text-muted-foreground">{t.form.freeLimit}</p>
      </div>
    </fieldset>
  );
}
