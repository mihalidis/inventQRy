import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, Shelf } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelvesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { shelves, removeShelf } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const handleShelfPress = useCallback(
    (shelf: Shelf) => navigation.navigate('ShelfDetail', { shelfId: shelf.id }),
    [navigation]
  );

  const handleDeleteShelf = useCallback(
    (shelf: Shelf) => {
      Alert.alert(
        'Rafı Sil',
        `"${shelf.name}" rafını ve içindeki tüm eşyaları silmek istediğinize emin misiniz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => removeShelf(shelf.id),
          },
        ]
      );
    },
    [removeShelf]
  );

  const renderShelf = useCallback(
    ({ item }: { item: Shelf }) => (
      <ShelfCard shelf={item} onPress={handleShelfPress} onDelete={handleDeleteShelf} />
    ),
    [handleShelfPress, handleDeleteShelf]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showLogo showProfile onProfile={() => navigation.navigate('Profile')} />

      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.DarkText }]}>{t.shelves}</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.PrimaryBlue }]}
          onPress={() => navigation.navigate('AddShelf')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>{t.newShelf.replace('+ ', '')}</Text>
        </TouchableOpacity>
      </View>

      {shelves.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={48}
            color={colors.GrayText}
          />
          <Text style={[styles.emptyTitle, { color: colors.DarkText }]}>{t.noShelvesYet}</Text>
          <Text style={[styles.emptyText, { color: colors.GrayText }]}>{t.createFirstShelf}</Text>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.Button,
    gap: 4,
  },
  addBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: '#FFFFFF',
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
    marginTop: 14,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
  },
});
