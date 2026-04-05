import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BorderChip from '../components/BorderChip';
import StatRow from '../components/StatRow';
import {useCountryDetail} from '../hooks/useCountryDetail';
import {RootStackParamList} from '../navigation/Navigator';
import {
  formatArea,
  formatPopulation,
  getCurrencyString,
  getLanguageString,
} from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'CountryDetail'>;

export default function CountryDetailScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const {code} = route.params;
  const {country, borderCountries, isLoading, error} = useCountryDetail(code);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3d7fff" />
        <Text style={styles.loadingText}>Loading details…</Text>
      </View>
    );
  }

  if (error || !country) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error ?? 'Country not found'}</Text>
      </View>
    );
  }

  const capital = country.capital?.join(', ') ?? 'N/A';
  const subregion = country.subregion ?? 'N/A';
  const area = country.area != null ? formatArea(country.area) : 'N/A';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Flag */}
      <Image
        source={{uri: country.flags.png}}
        style={styles.flag}
        resizeMode="cover"
        accessibilityLabel={country.flags.alt ?? `Flag of ${country.name.common}`}
      />

      {/* Official name */}
      <View style={styles.header}>
        <Text style={styles.officialName}>{country.name.official}</Text>
        <View style={styles.regionBadge}>
          <Text style={styles.regionBadgeText}>{country.region}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <StatRow label="Capital" value={capital} />
        <StatRow label="Subregion" value={subregion} />
        <StatRow label="Population" value={formatPopulation(country.population)} />
        <StatRow label="Area" value={area} />
        <StatRow
          label="Currencies"
          value={getCurrencyString(country.currencies)}
        />
        <StatRow
          label="Languages"
          value={getLanguageString(country.languages)}
        />
      </View>

      {/* Border countries */}
      {borderCountries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Border Countries</Text>
          <View style={styles.chipsContainer}>
            {borderCountries.map(b => (
              <BorderChip
                key={b.cca3}
                code={b.cca3}
                name={b.name}
                onPress={(borderCode, borderName) =>
                  navigation.push('CountryDetail', {
                    code: borderCode,
                    name: borderName,
                  })
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* Coordinates */}
      {country.latlng && (
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>
            {country.latlng[0].toFixed(4)}°{country.latlng[0] >= 0 ? 'N' : 'S'}
            {'  '}
            {country.latlng[1].toFixed(4)}°{country.latlng[1] >= 0 ? 'E' : 'W'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f14',
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0f14',
    gap: 12,
  },
  loadingText: {
    color: '#555e72',
    fontSize: 14,
    marginTop: 8,
  },
  errorIcon: {
    fontSize: 36,
  },
  errorText: {
    color: '#c4cad8',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  flag: {
    width: '100%',
    height: 220,
    backgroundColor: '#161a24',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  officialName: {
    flex: 1,
    color: '#e8eaf0',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  regionBadge: {
    backgroundColor: '#1a3a7a',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#3d7fff',
    flexShrink: 0,
    marginTop: 2,
  },
  regionBadgeText: {
    color: '#3d7fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#161a24',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1e2333',
    overflow: 'hidden',
  },
  sectionTitle: {
    color: '#555e72',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2333',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    marginHorizontal: -3,
  },
  coordRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  coordLabel: {
    color: '#2d3550',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
});
