import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Shelf } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { shelves } = useInventory();

  const handleShelfPress = useCallback(
    (shelf: Shelf) => navigation.navigate('ShelfDetail', { shelfId: shelf.id }),
    [navigation]
  );

  const renderShelf = useCallback(
    ({ item, index }: { item: Shelf; index: number }) => (
      <ShelfCard shelf={item} onPress={handleShelfPress} />
    ),
    [handleShelfPress]
  );

  const keyExtractor = useCallback((item: Shelf) => item.id, []);

  const ListHeader = () => (
    <View>
      {/* Hero Logo */}
      <View style={styles.heroContainer}>
        <Image
          source={require('../../assets/inventqry-icon.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Search Bar */}
      <SearchBar
        value=""
        onChangeText={() => {}}
        onFocus={() => navigation.navigate('Search')}
        onQRPress={() => (navigation as any).navigate('MainTabs', { screen: 'Scan' })}
        editable={false}
      />

      {/* Scan Now Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Scan' })}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={20} color={Colors.Background} />
        <Text style={styles.scanButtonText}>Scan Now</Text>
      </TouchableOpacity>

      {/* Section Header */}
      {shelves.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Shelves</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddShelf')}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header showLogo showNotification onNotification={() => console.log('Notifications')} />

      {shelves.length === 0 ? (
        <View style={styles.container}>
          <ListHeader />
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={36}
                color={Colors.PrimaryBlue}
              />
            </View>
            <Text style={styles.emptyTitle}>No shelves yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first shelf to start organizing
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('AddShelf')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={Colors.Background} />
              <Text style={styles.createButtonText}>Create Shelf</Text>
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
    backgroundColor: Colors.Background,
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
    backgroundColor: Colors.PrimaryBlue,
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
    color: Colors.Background,
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
    color: Colors.DarkText,
  },
  addText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.PrimaryBlue,
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
    backgroundColor: Colors.SecondaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.DarkText,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 28,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    gap: 6,
  },
  createButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.Background,
    fontSize: Typography.sizes.md,
  },
});
