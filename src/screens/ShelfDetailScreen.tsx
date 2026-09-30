import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import AddItemModal from '../components/AddItemModal';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { format } from '../i18n/translations';
import { RootStackParamList, Item } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'ShelfDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelfDetailScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById, getItemsForShelf, addItemToShelf, removeItemFromShelf, loading } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);

  const shelf = getShelfById(route.params.shelfId);
  const shelfItems = useMemo(
    () => (shelf ? getItemsForShelf(shelf.id) : []),
    [shelf, getItemsForShelf]
  );

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!shelf) return;
      Alert.alert(t.removeItemTitle, t.removeItemMessage, [
        { text: t.cancel, style: 'cancel' },
        { text: t.remove, style: 'destructive', onPress: () => removeItemFromShelf(shelf.id, itemId) },
      ]);
    },
    [shelf, removeItemFromShelf, t]
  );

  const handleAddItem = useCallback(
    async (name: string, description: string) => {
      if (!shelf) return;
      try {
        await addItemToShelf(shelf.id, name, description);
        setShowAddModal(false);
      } catch (e) {
        console.error('addItem error:', e);
        Alert.alert(t.error, t.addItemFailed);
      }
    },
    [shelf, addItemToShelf, t]
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.Background }]}>
        <ActivityIndicator size="large" color={colors.PrimaryBlue} />
      </View>
    );
  }

  if (!shelf) {
    return (
      <View style={[styles.container, { backgroundColor: colors.Background }]}>
        <Header showBack onBack={() => navigation.goBack()} />
        <View style={[styles.container, styles.centered]}>
          <Text style={[styles.notFoundText, { color: colors.GrayText }]}>{t.shelfNotFound}</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard item={item} onDelete={handleDeleteItem} />
  );

  const ListHeader = () => (
    <View>
      <View style={[styles.infoCard, { backgroundColor: colors.CardBg }]}>
        <View style={styles.infoTop}>
          <View style={[styles.shelfIconContainer, { backgroundColor: colors.Background }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={28} color={colors.PrimaryBlue} />
          </View>
          <View style={styles.infoDetails}>
            <Text style={[styles.shelfName, { color: colors.DarkText }]}>{shelf.name}</Text>
            <Text style={[styles.shelfLocation, { color: colors.GrayText }]}>{shelf.location}</Text>
          </View>
        </View>

        {/* QR her temada beyaz zeminde kalır; ekrandan doğrudan taranabilsin */}
        <View style={styles.qrPreview}>
          <QRCode value={shelf.qrCode} size={80} color="#000000" backgroundColor="#FFFFFF" />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryBtn, { borderColor: colors.PrimaryBlue }]}
            onPress={() => navigation.navigate('PrintQR', { shelfId: shelf.id })}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="qrcode" size={18} color={colors.PrimaryBlue} />
            <Text style={[styles.actionText, { color: colors.PrimaryBlue }]}>{t.printQR}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.PrimaryBlue }]}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={[styles.actionText, { color: '#FFFFFF' }]}>{t.addItem}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemsHeader}>
        <Text style={[styles.itemsTitle, { color: colors.DarkText }]}>
          {format(t.itemsHeader, { count: shelfItems.length })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={shelf.name} onBack={() => navigation.goBack()} />

      {shelfItems.length === 0 ? (
        <View style={styles.container}>
          <ListHeader />
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.GrayText }]}>{t.noItemsOnShelf}</Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: colors.PrimaryBlue }]}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.emptyAddText}>{t.addFirstItem}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={shelfItems}
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
  },
  infoCard: {
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
    marginBottom: 2,
  },
  shelfLocation: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
  },
  qrPreview: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.Card,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: Radius.Button,
    gap: 6,
  },
  secondaryBtn: {
    borderWidth: 1.5,
  },
  actionText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
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
    marginBottom: 16,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.Button,
    gap: 6,
  },
  emptyAddText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: '#FFFFFF',
  },
});
