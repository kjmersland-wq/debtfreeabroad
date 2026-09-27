import { en, type Dict } from "./en";
import { no } from "./no";
import { pl } from "./pl";
import { de } from "./de";

export type Locale = "en" | "no" | "pl" | "de";
export const locales: Locale[] = ["en", "no", "pl", "de"];

const dicts: Record<Locale, Dict> = { en, no, pl, de };

export const isLocale = (v: string): v is Locale => (locales as string[]).includes(v);

export const getDict = (locale: Locale): Dict => dicts[locale];

export type { Dict };
