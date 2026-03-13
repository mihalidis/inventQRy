import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import StyledText from '../components/atoms/StyledText';
import { useInventory } from '../hooks/useInventory';
import { Item, Shelf } from '../types/inventory';

interface SearchResult {
  item: Item;
  shelf: Shelf;
}

export default function SearchScreen() {
  const { searchItems } = useInventory();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchItems(query), [query, searchItems]);

  const renderResult = ({ item: result }: { item: SearchResult }) => (
    <View style={styles.resultCard}>
      <StyledText weight={600} style={styles.itemName}>
        {result.item.name}
      </StyledText>
      {result.item.description ? (
        <StyledText style={styles.description} numberOfLines={1}>
          {result.item.description}
        </StyledText>
      ) : null}
      <View style={styles.shelfInfo}>
        <StyledText weight={500} style={styles.shelfName}>
          {result.shelf.name}
        </StyledText>
        <StyledText style={styles.shelfLocation}>
          {result.shelf.location}
        </StyledText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for items..."
          placeholderTextColor="#B0B5BD"
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCapitalize="none"
        />
      </View>

      {query.trim() && results.length === 0 ? (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>
            No items found for "{query}"
          </StyledText>
        </View>
      ) : !query.trim() ? (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>
            Type to search across all your shelves
          </StyledText>
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
    backgroundColor: '#F5F7FA',
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2A3342',
    fontFamily: 'SometypeMono-Regular',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  itemName: {
    fontSize: 15,
    color: '#2A3342',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#8E9196',
    marginBottom: 8,
  },
  shelfInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  shelfName: {
    fontSize: 12,
    color: '#4A7BF7',
    marginRight: 8,
  },
  shelfLocation: {
    fontSize: 12,
    color: '#8E9196',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E9196',
  },
});
