import type { Dict, Locale } from "@/i18n";
import { AppLink } from "@/lib/locale";
import { Calculator } from "./Calculator";
import { WaitlistForm } from "./WaitlistForm";
import { baselines, destinationCountries, originCountries } from "@/data/costBaselines";

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <span className="num text-[11px] tracking-[0.12em] text-muted-foreground">{index}</span>
      <h2 className="mt-4 max-w-sm font-display text-4xl leading-[1.05] tracking-[-0.045em] sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function HomePage({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <>
      <section className="grid gap-10 pt-14 pb-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end lg:pt-20 lg:pb-14">
        <div>
          <p className="field-label">KM Tech Labs</p>
          <h1 className="mt-6 font-display text-[52px] leading-[0.98] tracking-[-0.055em] text-foreground sm:text-[64px] lg:text-[76px]">
            {t.hero.headline}
          </h1>
        </div>
        <div className="lg:border-l lg:border-border lg:pb-2 lg:pl-10">
          <p className="text-[17px] leading-relaxed text-ink-soft">{t.hero.sub}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#calculator" className="pill-primary">
              {t.result.title}
            </a>
            <AppLink to="/method" locale={locale} className="pill-secondary h-11 px-5 text-sm">
              {t.result.methodLink}
            </AppLink>
          </div>
        </div>
      </section>

      <div className="rule-top pt-12">
        <Calculator t={t} locale={locale} />
      </div>

      <section className="mt-28 grid gap-12 rule-top py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <SectionHead index="01" title={t.notWhat.title} />
        <ol className="divide-y divide-border border-y border-border">
          {[t.notWhat.a, t.notWhat.b, t.notWhat.c].map((line, i) => (
            <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 py-7">
              <span className="num font-display text-2xl tracking-[-0.04em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[17px] leading-relaxed text-ink-soft">{line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-12 rule-top py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <SectionHead index="02" title={t.method.title} />
        <div className="rounded-[1.75rem] border border-border bg-surface-raised p-8 sm:p-12">
          <p className="font-display text-2xl leading-snug tracking-[-0.03em] text-foreground sm:text-3xl">
            {t.method.lead}
          </p>
          <AppLink to="/method" locale={locale} className="pill-secondary mt-8 h-11 px-5 text-sm">
            {t.result.methodLink}
          </AppLink>
        </div>
      </section>

      <section className="rule-top py-24">
        <PricingBlock t={t} index="03" />
      </section>
    </>
  );
}

export function PricingBlock({ t, index }: { t: Dict; index?: string }) {
  const Item = ({ children }: { children: string }) => (
    <li className="flex items-baseline gap-3 border-t border-border py-3">
      <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-foreground" />
      {children}
    </li>
  );
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      {index ? (
        <SectionHead index={index} title={t.pricing.title} />
      ) : (
        <h2 className="font-display text-4xl tracking-[-0.045em] sm:text-5xl">{t.pricing.title}</h2>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col rounded-[1.75rem] border border-border p-8">
          <h3 className="field-label font-sans">{t.pricing.free}</h3>
          <p className="num mt-4 font-display text-6xl tracking-[-0.05em]">{t.pricing.freePrice}</p>
          <ul className="mt-8 text-sm text-ink-soft">
            <Item>1 destination</Item>
            <Item>3 debt rows</Item>
            <Item>Shareable link, browser-only storage</Item>
          </ul>
        </div>
        <div className="flex flex-col rounded-[1.75rem] border border-foreground bg-surface-raised p-8">
          <h3 className="field-label font-sans">{t.pricing.pro}</h3>
          <p className="mt-4 font-display text-6xl tracking-[-0.05em]">{t.pricing.proPrice}</p>
          <ul className="mt-8 text-sm text-ink-soft">
            <Item>Unlimited debt rows</Item>
            <Item>Compare 3 destinations</Item>
            <Item>Saved scenarios, PDF plan</Item>
            <Item>Inflation and income-change sliders</Item>
          </ul>
          <div className="mt-auto pt-4">
            <WaitlistForm t={t} />
          </div>
        </div>
      </div>
    </div>
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
