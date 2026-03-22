import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Spacing, Typography } from '../constants/theme';

interface HeaderProps {
  showLogo?: boolean;
  showBack?: boolean;
  showProfile?: boolean;
  title?: string;
  onBack?: () => void;
  onProfile?: () => void;
}

export default function Header({
  showLogo = false,
  showBack = false,
  showProfile = false,
  title,
  onBack,
  onProfile,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, backgroundColor: colors.Background }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.DarkText} />
          </TouchableOpacity>
        )}
        {showLogo && (
          <Image
            source={require('../../assets/inventqry-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        )}
        {title && !showLogo && (
          <Text style={[styles.title, { color: colors.DarkText }]}>{title}</Text>
        )}
      </View>
      <View style={styles.right}>
        {showProfile && (
          <TouchableOpacity onPress={onProfile} style={styles.iconBtn}>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={colors.PrimaryBlue}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 4,
  },
  logoImage: {
    width: 120,
    height: 36,
    marginLeft: -12,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
    marginLeft: 12,
  },
});
