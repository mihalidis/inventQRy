import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './atoms/StyledText';
import { Item } from '../types/inventory';

interface ItemCardProps {
  item: Item;
  onDelete: (itemId: string) => void;
}

function ItemCard({ item, onDelete }: ItemCardProps) {
  const formattedDate = new Date(item.dateAdded).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <StyledText weight={600} style={styles.name}>
          {item.name}
        </StyledText>
        {item.description ? (
          <StyledText style={styles.description} numberOfLines={2}>
            {item.description}
          </StyledText>
        ) : null}
        <StyledText style={styles.date}>{formattedDate}</StyledText>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <StyledText weight={600} style={styles.deleteText}>
          ✕
        </StyledText>
      </TouchableOpacity>
    </View>
  );
}

export default memo(ItemCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    color: '#2A3342',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#8E9196',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#B0B5BD',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 14,
    color: '#FFA26B',
  },
});
