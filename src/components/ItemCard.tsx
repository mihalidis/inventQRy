import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Typography } from '../constants/theme';
import { Item } from '../types/inventory';

interface ItemCardProps {
  item: Item;
  onDelete: (itemId: string) => void;
  shelfName?: string;
}

function ItemCardComponent({ item, onDelete, shelfName }: ItemCardProps) {
  const dateStr = new Date(item.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
        {shelfName && <Text style={styles.shelfName}>Shelf: {shelfName}</Text>}
        <Text style={styles.date}>{dateStr}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="delete-outline" size={22} color={Colors.Danger} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(ItemCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SecondaryWhite,
    borderRadius: Radius.Card,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.DarkText,
    marginBottom: 2,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    marginBottom: 4,
  },
  shelfName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
    color: Colors.PrimaryBlue,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    color: Colors.GrayText,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
});
