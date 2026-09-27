export type CountryCode =
  | "NO"
  | "DE"
  | "UK"
  | "NL"
  | "SE"
  | "US"
  | "PL"
  | "PT"
  | "ES"
  | "LT"
  | "LV"
  | "EE"
  | "CZ";

export type Baseline = {
  name: string;
  currency: string;
  /** Relative cost-of-living index, 100 = eurozone average. Internal 2026 baseline. */
  colIndex: number;
  /** All money figures below are monthly EUR. */
  rent1bedCapital: number;
  rent1bedSecond: number;
  rent2bedCapital: number;
  otherLivingSolo: number;
  otherLivingCouple: number;
  /** Multiplier applied to home net income when taking a local job instead of keeping income. */
  localIncomeFactor: number;
};

export const baselines: Record<CountryCode, Baseline> = {
  NO: {
    name: "Norway",
    currency: "NOK",
    colIndex: 148,
    rent1bedCapital: 1550,
    rent1bedSecond: 1150,
    rent2bedCapital: 2050,
    otherLivingSolo: 1250,
    otherLivingCouple: 1950,
    localIncomeFactor: 1.0,
  },
  DE: {
    name: "Germany",
    currency: "EUR",
    colIndex: 118,
    rent1bedCapital: 1320,
    rent1bedSecond: 950,
    rent2bedCapital: 1850,
    otherLivingSolo: 980,
    otherLivingCouple: 1560,
    localIncomeFactor: 1.0,
  },
  UK: {
    name: "United Kingdom",
    currency: "GBP",
    colIndex: 128,
    rent1bedCapital: 1980,
    rent1bedSecond: 1080,
    rent2bedCapital: 2650,
    otherLivingSolo: 1050,
    otherLivingCouple: 1680,
    localIncomeFactor: 1.0,
  },
  NL: {
    name: "Netherlands",
    currency: "EUR",
    colIndex: 124,
    rent1bedCapital: 1780,
    rent1bedSecond: 1230,
    rent2bedCapital: 2300,
    otherLivingSolo: 1010,
    otherLivingCouple: 1620,
    localIncomeFactor: 1.0,
  },
  SE: {
    name: "Sweden",
    currency: "SEK",
    colIndex: 126,
    rent1bedCapital: 1290,
    rent1bedSecond: 890,
    rent2bedCapital: 1720,
    otherLivingSolo: 1020,
    otherLivingCouple: 1610,
    localIncomeFactor: 1.0,
  },
  US: {
    name: "United States",
    currency: "USD",
    colIndex: 135,
    rent1bedCapital: 2100,
    rent1bedSecond: 1350,
    rent2bedCapital: 2800,
    otherLivingSolo: 1350,
    otherLivingCouple: 2100,
    localIncomeFactor: 1.0,
  },
  PL: {
    name: "Poland",
    currency: "PLN",
    colIndex: 62,
    rent1bedCapital: 780,
    rent1bedSecond: 540,
    rent2bedCapital: 1050,
    otherLivingSolo: 560,
    otherLivingCouple: 900,
    localIncomeFactor: 0.42,
  },
  PT: {
    name: "Portugal",
    currency: "EUR",
    colIndex: 74,
    rent1bedCapital: 1150,
    rent1bedSecond: 720,
    rent2bedCapital: 1520,
    otherLivingSolo: 650,
    otherLivingCouple: 1040,
    localIncomeFactor: 0.45,
  },
  ES: {
    name: "Spain",
    currency: "EUR",
    colIndex: 79,
    rent1bedCapital: 1180,
    rent1bedSecond: 780,
    rent2bedCapital: 1560,
    otherLivingSolo: 700,
    otherLivingCouple: 1120,
    localIncomeFactor: 0.5,
  },
  LT: {
    name: "Lithuania",
    currency: "EUR",
    colIndex: 66,
    rent1bedCapital: 720,
    rent1bedSecond: 490,
    rent2bedCapital: 980,
    otherLivingSolo: 580,
    otherLivingCouple: 930,
    localIncomeFactor: 0.44,
  },
  LV: {
    name: "Latvia",
    currency: "EUR",
    colIndex: 64,
    rent1bedCapital: 650,
    rent1bedSecond: 450,
    rent2bedCapital: 880,
    otherLivingSolo: 560,
    otherLivingCouple: 900,
    localIncomeFactor: 0.4,
  },
  EE: {
    name: "Estonia",
    currency: "EUR",
    colIndex: 70,
    rent1bedCapital: 740,
    rent1bedSecond: 500,
    rent2bedCapital: 1000,
    otherLivingSolo: 600,
    otherLivingCouple: 960,
    localIncomeFactor: 0.46,
  },
  CZ: {
    name: "Czechia",
    currency: "CZK",
    colIndex: 68,
    rent1bedCapital: 860,
    rent1bedSecond: 600,
    rent2bedCapital: 1150,
    otherLivingSolo: 610,
    otherLivingCouple: 980,
    localIncomeFactor: 0.45,
  },
};

export const originCountries: CountryCode[] = ["NO", "DE", "UK", "NL", "SE", "US"];
export const destinationCountries: CountryCode[] = ["PL", "PT", "ES", "LT", "LV", "EE", "CZ"];

/** Static display rates, EUR -> currency. Internal 2026 baseline, not a live feed. */
export const displayRates: Record<string, number> = {
  EUR: 1,
  NOK: 11.6,
  PLN: 4.3,
  GBP: 0.85,
  USD: 1.08,
  SEK: 11.3,
  CZK: 25.2,
};

export type DisplayCurrency = "EUR" | "NOK" | "PLN" | "GBP" | "USD";
export const displayCurrencies: DisplayCurrency[] = ["EUR", "NOK", "PLN", "GBP", "USD"];
