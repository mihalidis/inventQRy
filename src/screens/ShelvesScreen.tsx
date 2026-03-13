import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StyledText from '../components/atoms/StyledText';
import ShelfCard from '../components/ShelfCard';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Shelf } from '../types/inventory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelvesScreen() {
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <StyledText weight={900} style={styles.title}>Shelves</StyledText>
        <TouchableOpacity onPress={() => navigation.navigate('AddShelf')}>
          <StyledText weight={600} style={styles.addButton}>+ New</StyledText>
        </TouchableOpacity>
      </View>
      {shelves.length === 0 ? (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>
            No shelves created yet
          </StyledText>
        </View>
      ) : (
        <FlatList
          data={shelves}
          renderItem={renderShelf}
          keyExtractor={(item) => item.id}
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
  },
  emptyText: {
    fontSize: 14,
    color: '#8E9196',
  },
});
