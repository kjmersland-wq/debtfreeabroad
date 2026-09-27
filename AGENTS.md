<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## DebtFreeAbroad rules
- Payoff engine lives in `src/lib/calc.ts` as deterministic arithmetic only — no model/API calls, so every result is reproducible in a spreadsheet.
- Living-cost figures come only from the static table in `src/data/costBaselines.ts` (EUR, internal 2026 baseline), never from a live feed.
- UI copy lives in `src/i18n/{en,no,pl,de}.ts` typed against `Dict`; pages read it via `useLocale()` so locale-prefixed routes (`/$locale/*`) share one implementation.
