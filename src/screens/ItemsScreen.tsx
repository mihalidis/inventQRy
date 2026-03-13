import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StyledText from '../components/atoms/StyledText';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Item, Shelf } from '../types/inventory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FlatItem {
  item: Item;
  shelf: Shelf;
}

export default function ItemsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { shelves } = useInventory();

  const allItems = useMemo<FlatItem[]>(() => {
    const items: FlatItem[] = [];
    for (const shelf of shelves) {
      for (const item of shelf.items) {
        items.push({ item, shelf });
      }
    }
    return items.sort(
      (a, b) => new Date(b.item.dateAdded).getTime() - new Date(a.item.dateAdded).getTime()
    );
  }, [shelves]);

  const renderItem = ({ item: entry }: { item: FlatItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShelfDetail', { shelfId: entry.shelf.id })}
      activeOpacity={0.7}
    >
      <StyledText weight={600} style={styles.itemName}>
        {entry.item.name}
      </StyledText>
      {entry.item.description ? (
        <StyledText style={styles.description} numberOfLines={1}>
          {entry.item.description}
        </StyledText>
      ) : null}
      <View style={styles.meta}>
        <View style={styles.shelfTag}>
          <StyledText weight={500} style={styles.shelfName}>
            {entry.shelf.name}
          </StyledText>
        </View>
        <StyledText style={styles.location}>{entry.shelf.location}</StyledText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <StyledText weight={900} style={styles.title}>All Items</StyledText>
        <StyledText style={styles.count}>
          {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
        </StyledText>
      </View>
      {allItems.length === 0 ? (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>
            No items added yet. Add items to your shelves to see them here.
          </StyledText>
        </View>
      ) : (
        <FlatList
          data={allItems}
          renderItem={renderItem}
          keyExtractor={(entry) => entry.item.id}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    color: '#2A3342',
  },
  count: {
    fontSize: 13,
    color: '#8E9196',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
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
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  shelfTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  shelfName: {
    fontSize: 11,
    color: '#4A7BF7',
  },
  location: {
    fontSize: 12,
    color: '#8E9196',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E9196',
    textAlign: 'center',
  },
});
