import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { format, locales } from '../i18n/translations';
import { Item } from '../types/inventory';

interface ItemCardProps {
  item: Item;
  onDelete: (itemId: string) => void;
  shelfName?: string;
}

function ItemCardComponent({ item, onDelete, shelfName }: ItemCardProps) {
  const { colors } = useTheme();
  const { t, language } = useLanguage();

  const dateStr = new Date(item.createdAt).toLocaleDateString(locales[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.CardBg }]}>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.DarkText }]}>{item.name}</Text>
        {item.description ? (
          <Text style={[styles.description, { color: colors.GrayText }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {shelfName && (
          <Text style={[styles.shelfName, { color: colors.PrimaryBlue }]}>
            {format(t.shelfLabel, { name: shelfName })}
          </Text>
        )}
        <Text style={[styles.date, { color: colors.GrayText }]}>{dateStr}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={t.remove}
      >
        <MaterialCommunityIcons name="delete-outline" size={22} color={colors.Danger} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(ItemCardComponent);

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 2,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginBottom: 4,
  },
  shelfName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
    marginBottom: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
});
