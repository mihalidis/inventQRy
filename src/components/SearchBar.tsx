import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onQRPress?: () => void;
  placeholder?: string;
  editable?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onFocus,
  onQRPress,
  placeholder = 'Search an items...',
  editable = true,
}: SearchBarProps) {
  const content = (
    <View style={styles.container} pointerEvents={editable ? 'auto' : 'none'}>
      <Ionicons name="search" size={20} color={Colors.GrayText} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={Colors.GrayText}
        editable={editable}
      />
      {onQRPress && (
        <TouchableOpacity onPress={onQRPress} style={styles.qrBtn} pointerEvents="auto">
          <MaterialCommunityIcons name="qrcode-scan" size={20} color={Colors.PrimaryBlue} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!editable && onFocus) {
    return (
      <TouchableOpacity onPress={onFocus} activeOpacity={0.7}>
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
    backgroundColor: Colors.InputBg,
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
    color: Colors.DarkText,
    paddingVertical: 0,
  },
  qrBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
