// ISO 3166-1 alpha-2 → flag emoji + display name, for the countries in the
// seed registry (extensible: unknown codes fall back to the raw code).

const COUNTRY_NAMES: Record<string, string> = {
  CZ: 'Czechia',
  NL: 'Netherlands',
  BE: 'Belgium',
  FR: 'France',
  CH: 'Switzerland',
  CA: 'Canada',
  GB: 'United Kingdom',
  US: 'United States',
  QA: 'Qatar',
  DE: 'Germany',
  AT: 'Austria',
  ES: 'Spain',
  IT: 'Italy',
  PT: 'Portugal',
  BR: 'Brazil',
  VN: 'Vietnam',
};

/** Turn a two-letter country code into its flag emoji. */
export function flagEmoji(country: string): string {
  if (!/^[A-Za-z]{2}$/.test(country)) return '🏳️';
  const codePoints = country
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

export function countryName(country: string): string {
  return COUNTRY_NAMES[country] ?? country;
}
