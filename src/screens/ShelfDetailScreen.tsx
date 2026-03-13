import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StyledText from '../components/atoms/StyledText';
import ItemCard from '../components/ItemCard';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList, Item } from '../types/inventory';

type ScreenRoute = RouteProp<RootStackParamList, 'ShelfDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelfDetailScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById, addItemToShelf, removeItemFromShelf, removeShelf } = useInventory();

  const shelf = getShelfById(route.params.shelfId);

  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = useCallback(() => {
    if (!shelf || !itemName.trim()) return;
    addItemToShelf(shelf.id, itemName.trim(), itemDescription.trim());
    setItemName('');
    setItemDescription('');
    setShowForm(false);
  }, [shelf, itemName, itemDescription, addItemToShelf]);

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!shelf) return;
      Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItemFromShelf(shelf.id, itemId) },
      ]);
    },
    [shelf, removeItemFromShelf]
  );

  const handleDeleteShelf = useCallback(() => {
    if (!shelf) return;
    Alert.alert('Delete Shelf', `Delete "${shelf.name}" and all its items?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeShelf(shelf.id);
          navigation.goBack();
        },
      },
    ]);
  }, [shelf, removeShelf, navigation]);

  if (!shelf) {
    return (
      <View style={styles.centered}>
        <StyledText weight={500} style={styles.notFound}>Shelf not found</StyledText>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard item={item} onDelete={handleDeleteItem} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <StyledText style={styles.label}>Location</StyledText>
            <StyledText weight={500} style={styles.value}>{shelf.location}</StyledText>
          </View>
          <View style={styles.infoBlock}>
            <StyledText style={styles.label}>Items</StyledText>
            <StyledText weight={500} style={styles.value}>{shelf.items.length}</StyledText>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => navigation.navigate('PrintQR', { shelfId: shelf.id })}
            activeOpacity={0.7}
          >
            <StyledText weight={600} style={styles.qrButtonText}>View QR</StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteShelfButton}
            onPress={handleDeleteShelf}
            activeOpacity={0.7}
          >
            <StyledText weight={600} style={styles.deleteShelfText}>Delete Shelf</StyledText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemsHeader}>
        <StyledText weight={600} style={styles.itemsTitle}>Items</StyledText>
        <TouchableOpacity onPress={() => setShowForm((v) => !v)}>
          <StyledText weight={600} style={styles.addItemButton}>
            {showForm ? 'Cancel' : '+ Add Item'}
          </StyledText>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Item name"
            placeholderTextColor="#B0B5BD"
            value={itemName}
            onChangeText={setItemName}
            autoFocus
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            placeholderTextColor="#B0B5BD"
            value={itemDescription}
            onChangeText={setItemDescription}
          />
          <TouchableOpacity
            style={[styles.submitButton, !itemName.trim() && styles.submitDisabled]}
            onPress={handleAddItem}
            disabled={!itemName.trim()}
            activeOpacity={0.7}
          >
            <StyledText weight={600} style={styles.submitText}>Add Item</StyledText>
          </TouchableOpacity>
        </View>
      )}

      {shelf.items.length === 0 ? (
        <View style={styles.emptyState}>
          <StyledText style={styles.emptyText}>No items on this shelf yet</StyledText>
        </View>
      ) : (
        <FlatList
          data={shelf.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  notFound: {
    fontSize: 16,
    color: '#8E9196',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#8E9196',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#2A3342',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qrButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#4A7BF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  deleteShelfButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteShelfText: {
    color: '#FFA26B',
    fontSize: 14,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 16,
    color: '#2A3342',
  },
  addItemButton: {
    fontSize: 14,
    color: '#4A7BF7',
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#2A3342',
    fontFamily: 'SometypeMono-Regular',
    marginBottom: 10,
  },
  submitButton: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#6EE7B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#2A3342',
    fontSize: 14,
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
