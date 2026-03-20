import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Item, Shelf } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FlatItem {
  item: Item;
  shelf: Shelf;
}

export default function ItemsScreen() {
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

  const renderItem = ({ item: entry }: { item: FlatItem }) => {
    const dateStr = new Date(entry.item.dateAdded).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ShelfDetail', { shelfId: entry.shelf.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Text style={styles.itemName} numberOfLines={1}>{entry.item.name}</Text>
          {entry.item.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {entry.item.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <View style={styles.shelfTag}>
              <Text style={styles.shelfName}>{entry.shelf.name}</Text>
            </View>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header showLogo showNotification />

      <View style={styles.titleRow}>
        <Text style={styles.title}>All Items</Text>
        <View style={styles.countBadge}>
          <Text style={styles.count}>{allItems.length}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <SearchBar
          value=""
          onChangeText={() => {}}
          onFocus={() => navigation.navigate('Search')}
          editable={false}
          placeholder="Search items..."
        />
      </View>

      {allItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={48} color={Colors.Border} />
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptyText}>
            Add items to your shelves to see them here
          </Text>
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
    backgroundColor: Colors.Background,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.ScreenPadding,
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xxl,
    color: Colors.DarkText,
  },
  countBadge: {
    height: 28,
    minWidth: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: Colors.SecondaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.PrimaryBlue,
  },
  list: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.SecondaryWhite,
    borderRadius: Radius.Card,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
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
    gap: 8,
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
    marginTop: 14,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
