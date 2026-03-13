import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './atoms/StyledText';
import { Shelf } from '../types/inventory';

interface ShelfCardProps {
  shelf: Shelf;
  onPress: (shelfId: string) => void;
}

function ShelfCard({ shelf, onPress }: ShelfCardProps) {
  const formattedDate = new Date(shelf.dateAdded).toLocaleDateString();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shelf.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <StyledText weight={600} style={styles.name}>
          {shelf.name}
        </StyledText>
        <View style={styles.badge}>
          <StyledText weight={500} style={styles.badgeText}>
            {shelf.items.length} {shelf.items.length === 1 ? 'item' : 'items'}
          </StyledText>
        </View>
      </View>
      <View style={styles.details}>
        <StyledText style={styles.location}>{shelf.location}</StyledText>
        <StyledText style={styles.date}>{formattedDate}</StyledText>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ShelfCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    color: '#2A3342',
    flex: 1,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#4A7BF7',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    color: '#8E9196',
  },
  date: {
    fontSize: 12,
    color: '#8E9196',
  },
});
