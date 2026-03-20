import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { Shelf } from '../types/inventory';

interface ShelfCardProps {
  shelf: Shelf;
  onPress: (shelf: Shelf) => void;
  showCheckmark?: boolean;
}

function ShelfCardComponent({ shelf, onPress, showCheckmark = false }: ShelfCardProps) {
  const dateStr = new Date(shelf.dateAdded).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shelf)}
      activeOpacity={0.7}
    >
      {showCheckmark && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.SuccessGreen} />
        </View>
      )}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={32}
          color={Colors.PrimaryBlue}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>{shelf.name}</Text>
      <Text style={styles.count}>{shelf.items.length} Items</Text>
      <Text style={styles.date}>{dateStr}</Text>
    </TouchableOpacity>
  );
}

export default memo(ShelfCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.SecondaryWhite,
    borderRadius: Radius.Card,
    padding: Spacing.CardPadding,
    alignItems: 'center',
    flex: 1,
    margin: 6,
    minHeight: 130,
    position: 'relative',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.Background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.DarkText,
    textAlign: 'center',
    marginBottom: 2,
  },
  count: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    color: Colors.GrayText,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    color: Colors.GrayText,
  },
});
