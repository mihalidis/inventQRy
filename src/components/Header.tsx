import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';

interface HeaderProps {
  showLogo?: boolean;
  showBack?: boolean;
  showNotification?: boolean;
  title?: string;
  onBack?: () => void;
  onNotification?: () => void;
}

export default function Header({
  showLogo = false,
  showBack = false,
  showNotification = false,
  title,
  onBack,
  onNotification,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.DarkText} />
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
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      <View style={styles.right}>
        {showNotification && (
          <TouchableOpacity onPress={onNotification} style={styles.iconBtn}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={Colors.DarkText}
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
    backgroundColor: Colors.Background,
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
    width: 140,
    height: 40,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.DarkText,
    marginLeft: 12,
  },
});
