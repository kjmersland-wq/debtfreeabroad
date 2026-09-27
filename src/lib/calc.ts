import {
  baselines,
  type CountryCode,
} from "@/data/costBaselines";

export type Household = "single" | "couple" | "family";

export type Debt = {
  id: string;
  name: string;
  balance: number; // display currency
  apr: number; // percent per year
  minimum: number; // per month
  extra: number; // per month
};

export type CityTier = "capital" | "second" | "smaller";
export type HousingMode = "rent1" | "rent2" | "buyLater";

export type Inputs = {
  from: CountryCode;
  to: CountryCode;
  household: Household;
  children: number;
  netIncome: number; // per month, display currency
  currentCosts: number | null; // per month, display currency; null = country default
  debts: Debt[];
  cityTier: CityTier;
  housing: HousingMode;
  keepIncome: boolean;
  moveCost: number; // one-time, display currency
};

export const householdFactor = (household: Household, children: number) => {
  const base = household === "single" ? 1 : 1.6;
  return base + 0.25 * (household === "family" ? children : 0);
};

/** Monthly living cost estimate for a country, in EUR. */
export function livingCost(
  country: CountryCode,
  opts: {
    household: Household;
    children: number;
    cityTier: CityTier;
    housing: HousingMode;
  },
): { rent: number; other: number; total: number } {
  const b = baselines[country];
  const wantsTwoBed = opts.housing === "rent2" || opts.household !== "single";
  let rent = wantsTwoBed ? b.rent2bedCapital : b.rent1bedCapital;
  if (opts.cityTier === "second") rent *= b.rent1bedSecond / b.rent1bedCapital;
  if (opts.cityTier === "smaller") rent *= 0.78 * (b.rent1bedSecond / b.rent1bedCapital);

  const otherBase = opts.household === "single" ? b.otherLivingSolo : b.otherLivingCouple;
  const other = otherBase * (1 + 0.2 * (opts.household === "family" ? opts.children : 0));

  const rentR = Math.round(rent);
  const otherR = Math.round(other);
  return { rent: rentR, other: otherR, total: rentR + otherR };
}

export type PayoffResult = {
  months: number; // Infinity-safe: capped at 600
  totalInterest: number;
  /** Remaining total balance at the end of each month, index 0 = after month 1. */
  balanceByMonth: number[];
  neverPaidOff: boolean;
};

/**
 * Deterministic avalanche amortization.
 * Each month, for every debt:
 *   interest_i = balance_i * (apr_i / 100 / 12)
 *   balance_i  = balance_i + interest_i - payment_i
 * Payments: each debt gets min(minimum_i, balance_i); any remaining budget goes to
 * the highest-APR debt with a balance, until the budget is used up.
 */
export function simulatePayoff(debts: Debt[], monthlyBudget: number): PayoffResult {
  let balances = debts.map((d) => Math.max(0, d.balance));
  const rates = debts.map((d) => Math.max(0, d.apr) / 100 / 12);
  const mins = debts.map((d) => Math.max(0, d.minimum));
  const order = debts
    .map((_, i) => i)
    .sort((a, b) => rates[b] - rates[a]);

  const balanceByMonth: number[] = [];
  let totalInterest = 0;
  const MAX = 600;

  for (let month = 1; month <= MAX; month++) {
    // 1. interest
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0) continue;
      const interest = balances[i] * rates[i];
      totalInterest += interest;
      balances[i] += interest;
    }
    // 2. payments
    let budget = Math.max(0, monthlyBudget);
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0) continue;
      const pay = Math.min(mins[i], balances[i], budget);
      balances[i] -= pay;
      budget -= pay;
    }
    for (const i of order) {
      if (budget <= 0) break;
      if (balances[i] <= 0) continue;
      const pay = Math.min(balances[i], budget);
      balances[i] -= pay;
      budget -= pay;
    }

    const total = balances.reduce((s, b) => s + Math.max(0, b), 0);
    balanceByMonth.push(total);
    if (total <= 0.01) {
      return { months: month, totalInterest, balanceByMonth, neverPaidOff: false };
    }
  }

  return { months: MAX, totalInterest, balanceByMonth, neverPaidOff: true };
}

export type Scenario = {
  income: number;
  living: number;
  minimums: number;
  surplus: number; // available for debt beyond minimums
  toDebt: number; // total monthly money going to debt
  payoff: PayoffResult;
};

export type CalcResult = {
  home: Scenario;
  abroad: Scenario;
  monthsSaved: number;
  extraCashFreed: number;
  moveCostMonths: number;
  homeLiving: { rent: number; other: number; total: number };
  abroadLiving: { rent: number; other: number; total: number };
};

export function calculate(input: Inputs): CalcResult {
  const debts = input.debts.filter((d) => d.balance > 0);
  const minimums = debts.reduce((s, d) => s + Math.max(0, d.minimum), 0);
  const extras = debts.reduce((s, d) => s + Math.max(0, d.extra), 0);

  const opts = {
    household: input.household,
    children: input.children,
    cityTier: input.cityTier,
    housing: input.housing,
  };
  const homeLiving = livingCost(input.from, { ...opts, cityTier: "capital" });
  const abroadLiving = livingCost(input.to, opts);

  const homeCosts = input.currentCosts ?? homeLiving.total;
  const homeSurplus = Math.max(0, input.netIncome - homeCosts - minimums);
  const homeToDebt = minimums + Math.min(homeSurplus, extras > 0 ? extras : homeSurplus);

  const abroadIncome = input.keepIncome
    ? input.netIncome
    : input.netIncome * baselines[input.to].localIncomeFactor;
  const abroadSurplus = Math.max(0, abroadIncome - abroadLiving.total - minimums);
  const abroadToDebt = minimums + abroadSurplus;

  const home: Scenario = {
    income: input.netIncome,
    living: homeCosts,
    minimums,
    surplus: homeSurplus,
    toDebt: homeToDebt,
    payoff: simulatePayoff(debts, homeToDebt),
  };
  const abroad: Scenario = {
    income: abroadIncome,
    living: abroadLiving.total,
    minimums,
    surplus: abroadSurplus,
    toDebt: abroadToDebt,
    payoff: simulatePayoff(debts, abroadToDebt),
  };

  const extraCashFreed = abroadToDebt - homeToDebt;
  const moveCostMonths =
    extraCashFreed > 0 ? Math.ceil(input.moveCost / extraCashFreed) : Infinity;

  return {
    home,
    abroad,
    monthsSaved: home.payoff.months - abroad.payoff.months,
    extraCashFreed,
    moveCostMonths,
    homeLiving,
    abroadLiving,
  };
}
