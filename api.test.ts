import {
  fetchAllCountries,
  fetchCountriesByRegion,
  fetchCountryByCode,
  searchCountries,
} from '../src/services/api';

const mockFetch = global.fetch as jest.Mock;

const mockCountrySummary = {
  name: {common: 'Germany', official: 'Federal Republic of Germany'},
  flags: {png: 'https://flagcdn.com/de.png', svg: 'https://flagcdn.com/de.svg'},
  capital: ['Berlin'],
  region: 'Europe',
  population: 83_240_525,
  cca3: 'DEU',
};

const mockCountryFull = {
  ...mockCountrySummary,
  subregion: 'Western Europe',
  area: 357_114,
  currencies: {EUR: {name: 'Euro', symbol: '€'}},
  languages: {deu: 'German'},
  borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
  cca2: 'DE',
  latlng: [51.0, 9.0] as [number, number],
};

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => data,
  });
}

function mockFailure(status: number, statusText: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  });
}

beforeEach(() => {
  mockFetch.mockClear();
});

describe('fetchAllCountries', () => {
  it('returns sorted array of countries', async () => {
    const unsorted = [
      {...mockCountrySummary, name: {common: 'Zimbabwe', official: 'Republic of Zimbabwe'}, cca3: 'ZWE'},
      mockCountrySummary,
    ];
    mockSuccess(unsorted);
    const result = await fetchAllCountries();
    expect(result[0].name.common).toBe('Germany');
    expect(result[1].name.common).toBe('Zimbabwe');
  });

  it('throws on network error', async () => {
    mockFailure(500, 'Internal Server Error');
    await expect(fetchAllCountries()).rejects.toThrow('Failed to fetch countries');
  });
});

describe('fetchCountryByCode', () => {
  it('returns first element of array response', async () => {
    mockSuccess([mockCountryFull]);
    const result = await fetchCountryByCode('DEU');
    expect(result.cca3).toBe('DEU');
    expect(result.name.common).toBe('Germany');
  });

  it('throws when response array is empty', async () => {
    mockSuccess([]);
    await expect(fetchCountryByCode('XXX')).rejects.toThrow('not found');
  });

  it('throws on API error', async () => {
    mockFailure(404, 'Not Found');
    await expect(fetchCountryByCode('XXX')).rejects.toThrow('Failed to fetch country');
  });
});

describe('fetchCountriesByRegion', () => {
  it('fetches and sorts by region', async () => {
    mockSuccess([mockCountrySummary]);
    const result = await fetchCountriesByRegion('Europe');
    expect(result).toHaveLength(1);
    expect(result[0].region).toBe('Europe');
  });

  it('throws on failure', async () => {
    mockFailure(500, 'Server Error');
    await expect(fetchCountriesByRegion('Europe')).rejects.toThrow(
      'Failed to fetch countries in region',
    );
  });
});

describe('searchCountries', () => {
  it('returns empty array on 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    });
    const result = await searchCountries('zzzzz');
    expect(result).toEqual([]);
  });

  it('returns sorted results on success', async () => {
    mockSuccess([mockCountrySummary]);
    const result = await searchCountries('germ');
    expect(result[0].name.common).toBe('Germany');
  });

  it('fetches all countries for empty query', async () => {
    mockSuccess([mockCountrySummary]);
    await searchCountries('');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/all'),
    );
  });
});
