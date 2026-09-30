import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onQRPress?: () => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onFocus,
  onQRPress,
  placeholder,
  editable = true,
  autoFocus = false,
}: SearchBarProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const content = (
    <View style={[styles.container, { backgroundColor: colors.InputBg }]}>
      <Ionicons name="search" size={20} color={colors.GrayText} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: colors.DarkText }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder ?? t.searchItemsPlaceholder}
        placeholderTextColor={colors.GrayText}
        editable={editable}
        autoFocus={autoFocus}
        pointerEvents={editable ? 'auto' : 'none'}
        returnKeyType="search"
        autoCorrect={false}
      />
      {onQRPress && (
        <TouchableOpacity onPress={onQRPress} style={styles.qrBtn} accessibilityLabel={t.scan}>
          <MaterialCommunityIcons name="qrcode-scan" size={20} color={colors.PrimaryBlue} />
        </TouchableOpacity>
      )}
    </View>
  );

  // Düzenlenemez modda tüm çubuk bir buton gibi davranır (Home/Items'tan Search'e geçiş)
  if (!editable && onFocus) {
    return (
      <TouchableOpacity onPress={onFocus} activeOpacity={0.7} accessibilityLabel={t.search}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.Input,
    paddingHorizontal: 12,
    marginHorizontal: Spacing.ScreenPadding,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    paddingVertical: 0,
  },
  qrBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
