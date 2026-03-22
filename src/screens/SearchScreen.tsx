import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Item, Shelf } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchResult {
  item: Item;
  shelf: Shelf;
}

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { searchItems } = useInventory();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      if (!text.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const found = await searchItems(text);
        setResults(found);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchItems]
  );

  const renderResult = ({ item: result }: { item: SearchResult }) => {
    const dateStr = new Date(result.item.createdAt).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => navigation.navigate('ShelfDetail', { shelfId: result.shelf.id })}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          <Text style={styles.itemName}>{result.item.name}</Text>
          {result.item.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {result.item.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <View style={styles.shelfTag}>
              <Text style={styles.shelfName}>{result.shelf.name}</Text>
            </View>
            <Text style={styles.location}>{result.shelf.location}</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        showBack
        title="Search"
        onBack={() => navigation.goBack()}
      />

      <View style={{ marginBottom: 12 }}>
        <SearchBar
          value={query}
          onChangeText={handleSearch}
          placeholder="Search for items..."
        />
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.PrimaryBlue} />
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No items found for "{query}"</Text>
        </View>
      ) : !query.trim() ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color={Colors.Border} />
          <Text style={styles.emptyTitle}>Search items</Text>
          <Text style={styles.emptyText}>
            Type to search across all your shelves
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(result) => result.item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  list: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: Colors.SecondaryWhite,
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
    color: Colors.DarkText,
    marginBottom: 2,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  shelfTag: {
    backgroundColor: Colors.Background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shelfName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
    color: Colors.PrimaryBlue,
  },
  location: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    color: Colors.GrayText,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    color: Colors.GrayText,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.lg,
    color: Colors.DarkText,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
  },
});
