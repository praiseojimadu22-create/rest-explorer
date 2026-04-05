import {
  formatArea,
  formatPopulation,
  getCurrencyString,
  getLanguageString,
} from '../src/utils/format';

describe('formatPopulation', () => {
  it('formats billions', () => {
    expect(formatPopulation(1_400_000_000)).toBe('1.40B');
  });

  it('formats millions', () => {
    expect(formatPopulation(67_000_000)).toBe('67.0M');
  });

  it('formats thousands', () => {
    expect(formatPopulation(500_000)).toBe('500.0K');
  });

  it('formats small numbers without suffix', () => {
    expect(formatPopulation(842)).toBe('842');
  });

  it('formats zero', () => {
    expect(formatPopulation(0)).toBe('0');
  });
});

describe('formatArea', () => {
  it('appends km² and localizes number', () => {
    expect(formatArea(9_596_960)).toMatch(/km²/);
    expect(formatArea(9_596_960)).toContain('9');
  });

  it('handles small area', () => {
    expect(formatArea(2)).toBe('2 km²');
  });
});

describe('getCurrencyString', () => {
  it('returns N/A for undefined', () => {
    expect(getCurrencyString(undefined)).toBe('N/A');
  });

  it('formats a single currency', () => {
    const currencies = {USD: {name: 'United States dollar', symbol: '$'}};
    expect(getCurrencyString(currencies)).toBe('United States dollar ($)');
  });

  it('formats multiple currencies joined by comma', () => {
    const currencies = {
      EUR: {name: 'Euro', symbol: '€'},
      CHF: {name: 'Swiss franc', symbol: 'Fr'},
    };
    const result = getCurrencyString(currencies);
    expect(result).toContain('Euro (€)');
    expect(result).toContain('Swiss franc (Fr)');
    expect(result).toContain(', ');
  });
});

describe('getLanguageString', () => {
  it('returns N/A for undefined', () => {
    expect(getLanguageString(undefined)).toBe('N/A');
  });

  it('formats a single language', () => {
    const languages = {eng: 'English'};
    expect(getLanguageString(languages)).toBe('English');
  });

  it('joins multiple languages with comma', () => {
    const languages = {fra: 'French', deu: 'German'};
    const result = getLanguageString(languages);
    expect(result).toContain('French');
    expect(result).toContain('German');
  });
});
