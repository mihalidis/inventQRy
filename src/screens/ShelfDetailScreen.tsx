import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import AddItemModal from '../components/AddItemModal';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Item } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'ShelfDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelfDetailScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById, addItemToShelf, removeItemFromShelf } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);

  const shelf = getShelfById(route.params.shelfId);

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!shelf) return;
      Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItemFromShelf(shelf.id, itemId),
        },
      ]);
    },
    [shelf, removeItemFromShelf]
  );

  const handleAddItem = useCallback(
    (name: string, description: string) => {
      if (!shelf) return;
      addItemToShelf(shelf.id, name, description);
      setShowAddModal(false);
    },
    [shelf, addItemToShelf]
  );

  if (!shelf) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFoundText}>Shelf not found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard item={item} onDelete={handleDeleteItem} />
  );

  const ListHeader = () => (
    <View>
      {/* Shelf Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoTop}>
          <View style={styles.shelfIconContainer}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={28}
              color={Colors.PrimaryBlue}
            />
          </View>
          <View style={styles.infoDetails}>
            <Text style={styles.shelfName}>{shelf.name}</Text>
            <Text style={styles.shelfLocation}>{shelf.location}</Text>
          </View>
        </View>

        {/* QR Preview */}
        <View style={styles.qrPreview}>
          <QRCode
            value={shelf.qrCode}
            size={80}
            color={Colors.DarkText}
            backgroundColor={Colors.Background}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.printQRBtn}
            onPress={() => navigation.navigate('PrintQR', { shelfId: shelf.id })}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="qrcode" size={18} color={Colors.Background} />
            <Text style={styles.printQRText}>Print QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color={Colors.Background} />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items Header */}
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsTitle}>Items ({shelf.items.length})</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        showBack
        title={shelf.name}
        onBack={() => navigation.goBack()}
      />

      {shelf.items.length === 0 ? (
        <View style={styles.container}>
          <ListHeader />
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items on this shelf yet</Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={18} color={Colors.Background} />
              <Text style={styles.emptyAddText}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={shelf.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddItemModal
        visible={showAddModal}
        shelfName={shelf.name}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    color: Colors.GrayText,
  },
  infoCard: {
    backgroundColor: Colors.SecondaryWhite,
    margin: Spacing.ScreenPadding,
    marginBottom: 12,
    borderRadius: Radius.Card,
    padding: 16,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  shelfIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.Background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoDetails: {
    flex: 1,
  },
  shelfName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: Colors.DarkText,
    marginBottom: 2,
  },
  shelfLocation: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
  },
  qrPreview: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: Colors.Background,
    borderRadius: Radius.Card,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  printQRBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    gap: 6,
  },
  printQRText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.Background,
  },
  addItemBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    gap: 6,
  },
  addItemText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.Background,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.ScreenPadding,
    marginBottom: 10,
  },
  itemsTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.DarkText,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: Spacing.ScreenPadding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    marginBottom: 16,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    gap: 6,
  },
  emptyAddText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.Background,
  },
});
