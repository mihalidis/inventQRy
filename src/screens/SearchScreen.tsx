import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { format, locales } from '../i18n/translations';
import { track } from '../services/analytics';
import { RootStackParamList, Item, Shelf } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchResult {
  item: Item;
  shelf: Shelf;
}

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { searchItems } = useInventory();
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  // Arama tamamen yerel veri üzerinde; her tuş vuruşunda anında sonuç
  const results = useMemo<SearchResult[]>(() => searchItems(query), [searchItems, query]);
  const hasQuery = query.trim().length > 0;

  const renderResult = ({ item: result }: { item: SearchResult }) => {
    const dateStr = new Date(result.item.createdAt).toLocaleDateString(locales[language], {
      day: 'numeric',
      month: 'short',
    });

    return (
      <TouchableOpacity
        style={[styles.resultCard, { backgroundColor: colors.CardBg }]}
        onPress={() => {
          track('search_used', { result_count: results.length });
          navigation.navigate('ShelfDetail', { shelfId: result.shelf.id });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          <Text style={[styles.itemName, { color: colors.DarkText }]}>{result.item.name}</Text>
          {result.item.description ? (
            <Text style={[styles.description, { color: colors.GrayText }]} numberOfLines={1}>
              {result.item.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <View style={[styles.shelfTag, { backgroundColor: colors.Background }]}>
              <Text style={[styles.shelfName, { color: colors.PrimaryBlue }]}>{result.shelf.name}</Text>
            </View>
            <Text style={[styles.metaText, { color: colors.GrayText }]}>{result.shelf.location}</Text>
            <Text style={[styles.metaText, { color: colors.GrayText }]}>{dateStr}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.GrayText} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={t.search} onBack={() => navigation.goBack()} />

      <View style={{ marginBottom: 12 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={t.searchItemsPlaceholder} autoFocus />
      </View>

      {!hasQuery ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color={colors.Border} />
          <Text style={[styles.emptyTitle, { color: colors.DarkText }]}>{t.searchTitle}</Text>
          <Text style={[styles.emptyText, { color: colors.GrayText }]}>{t.searchHint}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.GrayText }]}>
            {format(t.noResultsFor, { query: query.trim() })}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(result) => result.item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 20,
  },
  resultCard: {
    borderRadius: Radius.Card,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  itemName: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    marginBottom: 2,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  shelfTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shelfName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
  },
  metaText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.lg,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
});
