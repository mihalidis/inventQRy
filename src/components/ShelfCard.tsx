import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { format, locales } from '../i18n/translations';
import { Shelf } from '../types/inventory';

interface ShelfCardProps {
  shelf: Shelf;
  onPress: (shelf: Shelf) => void;
  onDelete?: (shelf: Shelf) => void;
  showCheckmark?: boolean;
}

function ShelfCardComponent({ shelf, onPress, onDelete, showCheckmark = false }: ShelfCardProps) {
  const { colors } = useTheme();
  const { t, language } = useLanguage();

  const dateStr = new Date(shelf.createdAt).toLocaleDateString(locales[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.CardBg }]}
      onPress={() => onPress(shelf)}
      onLongPress={() => onDelete?.(shelf)}
      activeOpacity={0.7}
      accessibilityLabel={shelf.name}
    >
      {showCheckmark && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color={colors.SuccessGreen} />
        </View>
      )}
      <View style={[styles.iconContainer, { backgroundColor: colors.Background }]}>
        <MaterialCommunityIcons name="package-variant-closed" size={32} color={colors.PrimaryBlue} />
      </View>
      <Text style={[styles.name, { color: colors.DarkText }]} numberOfLines={1}>{shelf.name}</Text>
      <Text style={[styles.count, { color: colors.GrayText }]}>
        {format(t.itemCount, { count: shelf.itemCount })}
      </Text>
      <Text style={[styles.date, { color: colors.GrayText }]}>{dateStr}</Text>
    </TouchableOpacity>
  );
}

export default memo(ShelfCardComponent);

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 2,
  },
  count: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
});
