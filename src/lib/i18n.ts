import type { Locale } from '@/types';
import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

export const defaultLocale: Locale = 'fr';
export const locales: Locale[] = ['fr', 'en'];

const translations: Record<Locale, typeof fr> = { fr, en };

type DeepKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${DeepKeyOf<T[K]>}` : K) : never }[keyof T]
  : never;

// Deeply get a nested key from an object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string | unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  if (current === undefined) return path;
  return current;
}

// Replace {variable} placeholders in a translation string
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{${key}}`;
  });
}

export function getTranslations(locale: Locale) {
  const t = translations[locale] || translations[defaultLocale];

  function translate(key: string, vars?: Record<string, string | number>): string {
    const value = getNestedValue(t as unknown as Record<string, unknown>, key);
    if (typeof value === 'string') return interpolate(value, vars);
    if (Array.isArray(value)) return JSON.stringify(value);
    return key; // fallback to key if not found
  }

  function tArray<T>(key: string): T[] {
    const value = getNestedValue(t as unknown as Record<string, unknown>, key);
    if (Array.isArray(value)) return value as T[];
    return [];
  }

  function tRaw<T>(key: string): T {
    const value = getNestedValue(t as unknown as Record<string, unknown>, key);
    return value as T;
  }

  return { t: translate, tArray, tRaw, locale };
}

export type TranslationFunction = ReturnType<typeof getTranslations>['t'];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Strip any existing locale prefix
  const stripped = path.replace(/^\/(fr|en)(\/|$)/, '/');
  return `/${locale}${stripped === '/' ? '' : stripped}`;
}
