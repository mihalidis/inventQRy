import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, Shelf } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
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

  const keyExtractor = useCallback((item: Shelf) => item.id, []);

  const ListHeader = () => (
    <View>
      <View style={styles.heroContainer}>
        <Image
          source={require('../../assets/inventqry-icon.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <SearchBar
        value=""
        onChangeText={() => {}}
        onFocus={() => navigation.navigate('Search')}
        onQRPress={() => (navigation as any).navigate('MainTabs', { screen: 'Scan' })}
        editable={false}
      />

      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: colors.PrimaryBlue }]}
        onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Scan' })}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>{t.scanNow}</Text>
      </TouchableOpacity>

      {shelves.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.DarkText }]}>{t.yourShelves}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddShelf')}>
            <Text style={[styles.addText, { color: colors.PrimaryBlue }]}>{t.add}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showLogo showProfile onProfile={() => navigation.navigate('Profile')} />

      {shelves.length === 0 ? (
        <View style={[styles.container, { backgroundColor: colors.Background }]}>
          <ListHeader />
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.CardBg }]}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={36}
                color={colors.PrimaryBlue}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.DarkText }]}>{t.noShelvesYet}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.GrayText }]}>
              {t.createFirstShelf}
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.PrimaryBlue }]}
              onPress={() => navigation.navigate('AddShelf')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>{t.createShelf}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={shelves}
          renderItem={renderShelf}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={ListHeader}
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
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  heroImage: {
    width: 160,
    height: 160,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.Button,
    marginHorizontal: Spacing.ScreenPadding,
    marginTop: 14,
    marginBottom: 20,
    paddingVertical: 14,
    gap: 8,
  },
  scanButtonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.ScreenPadding,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
  },
  addText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
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
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 28,
    borderRadius: Radius.Button,
    gap: 6,
  },
  createButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
  },
});
