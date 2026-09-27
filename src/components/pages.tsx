import type { Dict, Locale } from "@/i18n";
import { AppLink } from "@/lib/locale";
import { Calculator } from "./Calculator";
import { WaitlistForm } from "./WaitlistForm";
import { baselines, destinationCountries, originCountries } from "@/data/costBaselines";

export function HomePage({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <>
      <section className="pt-20 pb-14">
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
          KM Tech Labs
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
          {t.hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{t.hero.sub}</p>
      </section>

      <Calculator t={t} locale={locale} />

      <section className="mt-24">
        <h2 className="font-display text-3xl">{t.notWhat.title}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[t.notWhat.a, t.notWhat.b, t.notWhat.c].map((line, i) => (
            <p key={i} className="rule-top pt-4 text-sm leading-relaxed text-ink-soft">
              {line}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-24 paper-card p-8">
        <h2 className="font-display text-3xl">{t.method.title}</h2>
        <p className="mt-3 max-w-xl text-ink-soft">{t.method.lead}</p>
        <AppLink
          to="/method"
          locale={locale}
          className="mt-5 inline-block text-sm text-forest underline underline-offset-4"
        >
          {t.result.methodLink}
        </AppLink>
      </section>

      <section className="mt-24">
        <PricingBlock t={t} />
      </section>
    </>
  );
}

export function PricingBlock({ t }: { t: Dict }) {
  return (
    <>
      <h2 className="font-display text-3xl">{t.pricing.title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="paper-card p-6">
          <h3 className="text-xl">{t.pricing.free}</h3>
          <p className="num mt-2 font-display text-4xl">{t.pricing.freePrice}</p>
          <ul className="mt-5 space-y-2 text-sm text-ink-soft">
            <li className="rule-top pt-2">1 destination</li>
            <li className="rule-top pt-2">3 debt rows</li>
            <li className="rule-top pt-2">Shareable link, browser-only storage</li>
          </ul>
        </div>
        <div className="paper-card p-6">
          <h3 className="text-xl">{t.pricing.pro}</h3>
          <p className="mt-2 font-display text-4xl">{t.pricing.proPrice}</p>
          <ul className="mt-5 space-y-2 text-sm text-ink-soft">
            <li className="rule-top pt-2">Unlimited debt rows</li>
            <li className="rule-top pt-2">Compare 3 destinations</li>
            <li className="rule-top pt-2">Saved scenarios, PDF plan</li>
            <li className="rule-top pt-2">Inflation and income-change sliders</li>
          </ul>
          <WaitlistForm t={t} />
        </div>
      </div>
    </>
  );
}

export function MethodPage({ t }: { t: Dict }) {
  return (
    <article className="max-w-2xl py-20">
      <h1 className="font-display text-5xl">{t.method.title}</h1>
      <p className="mt-5 text-lg text-ink-soft">{t.method.lead}</p>

      <h2 className="mt-12 text-2xl">The payoff loop</h2>
      <p className="mt-3 text-ink-soft">
        For each month, for each debt: interest = balance × (APR ÷ 100 ÷ 12). Interest is added
        to the balance, then payments are applied. Every debt receives its minimum; any remaining
        monthly budget goes to the debt with the highest APR. The month a total balance reaches
        zero is the payoff month. The loop stops at 600 months.
      </p>
      <p className="mt-3 text-ink-soft">
        Monthly budget at home = net income − living costs. Monthly budget abroad = income (kept,
        or scaled by the local income factor) − destination living costs. Nothing else changes.
        You can reproduce every number in a spreadsheet.
      </p>

      <h2 className="mt-12 text-2xl">Where living costs come from</h2>
      <p className="mt-3 text-ink-soft">
        A static table of monthly rent and other living costs per country, adjusted by city tier
        and household size. Source: internal 2026 baseline, not live CPI. Figures in EUR;
        other currencies use fixed display rates.
      </p>
      <ul className="mt-5 space-y-1 text-sm text-ink-soft">
        {[...originCountries, ...destinationCountries].map((c) => (
          <li key={c} className="num flex justify-between rule-top pt-1.5">
            <span>{baselines[c].name}</span>
            <span>
              1-bed capital €{baselines[c].rent1bedCapital} · index {baselines[c].colIndex}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl">What is excluded</h2>
      <p className="mt-3 text-ink-soft">
        Tax residency, visas and permits, health insurance, double taxation, currency risk,
        inflation, income changes over time, mortgage transfer rules, school fees, and the cost of
        moving back. Buying property is informational only in v1. Every output is an estimate.
      </p>

      <h2 className="mt-12 text-2xl">No model, no AI</h2>
      <p className="mt-3 text-ink-soft">
        The engine is arithmetic in your browser. No requests are made with your figures, no text
        is generated, and the sentences shown next to a result are fixed copy chosen by numeric
        thresholds.
      </p>
    </article>
  );
}

export function PricingPage({ t }: { t: Dict }) {
  return (
    <div className="py-20">
      <PricingBlock t={t} />
    </div>
  );
}

export function PrivacyPage({ t }: { t: Dict }) {
  return (
    <article className="max-w-2xl py-20">
      <h1 className="font-display text-5xl">{t.footer.privacy}</h1>
      <p className="mt-5 text-ink-soft">
        DebtFreeAbroad runs its calculator in your browser. The figures you type are kept in
        local storage on your device and in the address bar so you can share a link. They are not
        sent to a server, and there is no account, no analytics profile and no advertising tracker.
      </p>
      <p className="mt-4 text-ink-soft">
        The waitlist form is the only place where you can give us an email address, and only if you
        submit it. Contact: KM Tech Labs.
      </p>
    </article>
  );
}

export function TermsPage({ t }: { t: Dict }) {
  return (
    <article className="max-w-2xl py-20">
      <h1 className="font-display text-5xl">{t.footer.terms}</h1>
      <p className="mt-5 text-ink-soft">
        DebtFreeAbroad provides estimates based on figures you enter and a static cost baseline. It
        is not financial, tax, legal or immigration advice. Decisions you make from these estimates
        are your own.
      </p>
      <p className="mt-4 text-ink-soft">
        The service is provided as is, without warranty. KM Tech Labs may change the baselines,
        the model or the service at any time.
      </p>
    </article>
  );
}

export function PlanPage({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <div className="py-16">
      <h1 className="font-display text-4xl">{t.nav.plan}</h1>
      <p className="mt-4 max-w-xl text-ink-soft">{t.hero.sub}</p>
      <div className="mt-10">
        <Calculator t={t} locale={locale} />
      </div>
    </div>
  );
}
