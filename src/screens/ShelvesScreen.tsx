import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Shelf } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelvesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { shelves } = useInventory();

  const handleShelfPress = useCallback(
    (shelf: Shelf) => navigation.navigate('ShelfDetail', { shelfId: shelf.id }),
    [navigation]
  );

  const renderShelf = useCallback(
    ({ item }: { item: Shelf }) => (
      <ShelfCard shelf={item} onPress={handleShelfPress} />
    ),
    [handleShelfPress]
  );

  return (
    <View style={styles.container}>
      <Header showLogo showNotification />

      <View style={styles.titleRow}>
        <Text style={styles.title}>Shelves</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddShelf')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color={Colors.Background} />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {shelves.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={48}
            color={Colors.GrayText}
          />
          <Text style={styles.emptyTitle}>No shelves created yet</Text>
          <Text style={styles.emptyText}>Tap "+ New" to create your first shelf</Text>
        </View>
      ) : (
        <FlatList
          data={shelves}
          renderItem={renderShelf}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    gap: 4,
  },
  addBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.Background,
  },
  gridRow: {
    paddingHorizontal: Spacing.ScreenPadding - 6,
  },
  list: {
    paddingBottom: 20,
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
  },
});
