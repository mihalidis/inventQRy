import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, Item, Shelf } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FlatItem {
  item: Item;
  shelf: Shelf;
}

export default function ItemsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { shelves, items } = useInventory();
  const { t, language } = useLanguage();
  const { colors } = useTheme();

  const allItems = useMemo<FlatItem[]>(() => {
    const shelfMap = new Map(shelves.map((s) => [s.id, s]));
    return items
      .map((item) => {
        const shelf = shelfMap.get(item.shelfId);
        return shelf ? { item, shelf } : null;
      })
      .filter((entry): entry is FlatItem => entry !== null)
      .sort(
        (a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime()
      );
  }, [shelves, items]);

  const renderItem = ({ item: entry }: { item: FlatItem }) => {
    const dateStr = new Date(entry.item.createdAt).toLocaleDateString(
      language === 'tr' ? 'tr-TR' : 'en-US',
      { day: 'numeric', month: 'short' }
    );

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.CardBg }]}
        onPress={() => navigation.navigate('ShelfDetail', { shelfId: entry.shelf.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.itemName, { color: colors.DarkText }]} numberOfLines={1}>
            {entry.item.name}
          </Text>
          {entry.item.description ? (
            <Text style={[styles.description, { color: colors.GrayText }]} numberOfLines={1}>
              {entry.item.description}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <View style={[styles.shelfTag, { backgroundColor: colors.Background }]}>
              <Text style={[styles.shelfName, { color: colors.PrimaryBlue }]}>
                {entry.shelf.name}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.GrayText }]}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showLogo showProfile onProfile={() => navigation.navigate('Profile')} />

      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.DarkText }]}>{t.allItems}</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.CardBg }]}>
          <Text style={[styles.count, { color: colors.PrimaryBlue }]}>{allItems.length}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <SearchBar
          value=""
          onChangeText={() => {}}
          onFocus={() => navigation.navigate('Search')}
          editable={false}
          placeholder={t.searchPlaceholder}
        />
      </View>

      {allItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={48} color={colors.Border} />
          <Text style={[styles.emptyTitle, { color: colors.DarkText }]}>{t.noResults}</Text>
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
  },
  countBadge: {
    height: 28,
    minWidth: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
  },
  list: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 20,
  },
  card: {
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
    gap: 8,
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
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
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
    marginTop: 14,
    marginBottom: 4,
  },
});
