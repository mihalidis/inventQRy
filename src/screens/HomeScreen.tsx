import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StyledText from '../components/atoms/StyledText';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Shelf } from '../types/inventory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { shelves } = useInventory();

  const handleShelfPress = useCallback(
    (shelfId: string) => navigation.navigate('ShelfDetail', { shelfId }),
    [navigation]
  );

  const renderShelf = useCallback(
    ({ item }: { item: Shelf }) => (
      <ShelfCard shelf={item} onPress={handleShelfPress} />
    ),
    [handleShelfPress]
  );

  const keyExtractor = useCallback((item: Shelf) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <StyledText weight={900} style={styles.title}>
          InventQRy
        </StyledText>
        <StyledText style={styles.subtitle}>
          Organize your world with QR codes
        </StyledText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
        >
          <StyledText style={styles.searchPlaceholder}>Search items...</StyledText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <StyledText weight={600} style={styles.sectionTitle}>
          Your Shelves
        </StyledText>
        <TouchableOpacity onPress={() => navigation.navigate('AddShelf')}>
          <StyledText weight={600} style={styles.addButton}>
            + Add
          </StyledText>
        </TouchableOpacity>
      </View>

      {shelves.length === 0 ? (
        <View style={styles.emptyState}>
          <StyledText weight={600} style={styles.emptyIcon}>
            📦
          </StyledText>
          <StyledText weight={500} style={styles.emptyTitle}>
            No shelves yet
          </StyledText>
          <StyledText style={styles.emptySubtitle}>
            Tap "+ Add" to create your first shelf
          </StyledText>
        </View>
      ) : (
        <FlatList
          data={shelves}
          renderItem={renderShelf}
          keyExtractor={keyExtractor}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    color: '#2A3342',
  },
  subtitle: {
    fontSize: 13,
    color: '#8E9196',
    marginTop: 2,
  },
  actions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EBF0',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#B0B5BD',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#2A3342',
  },
  addButton: {
    fontSize: 14,
    color: '#4A7BF7',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    color: '#2A3342',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E9196',
  },
});
