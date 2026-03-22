import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  label: string;
  subtitle: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { shelves, items } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const totalItems = items.length;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      setLoggingOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      iconFamily: 'Ionicons',
      label: t.accountSettings,
      subtitle: t.accountSettingsDesc,
    },
    {
      icon: 'cog-outline',
      iconFamily: 'MaterialCommunityIcons',
      label: t.appPreferences,
      subtitle: t.appPreferencesDesc,
      onPress: () => navigation.navigate('AppPreferences'),
    },
    {
      icon: 'information-outline',
      iconFamily: 'MaterialCommunityIcons',
      label: t.about,
      subtitle: t.aboutDesc,
    },
  ];

  const renderIcon = (item: MenuItem, size: number, color: string) => {
    if (item.iconFamily === 'Ionicons') {
      return <Ionicons name={item.icon as any} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={item.icon as any} size={size} color={color} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.Background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.DarkText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.DarkText }]}>{t.profile}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.CardBg }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={colors.PrimaryBlue} />
          </View>
          <Text style={[styles.userName, { color: colors.DarkText }]}>
            {user?.displayName || t.user}
          </Text>
          <Text style={[styles.userEmail, { color: colors.GrayText }]}>
            {user?.email || ''}
          </Text>
        </View>

        {/* Stats Panel */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.CardBg }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.Background }]}>
              <Ionicons name="layers-outline" size={22} color={colors.PrimaryBlue} />
            </View>
            <Text style={[styles.statValue, { color: colors.DarkText }]}>{shelves.length}</Text>
            <Text style={[styles.statLabel, { color: colors.GrayText }]}>{t.totalShelves}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.CardBg }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.Background }]}>
              <Ionicons name="list-outline" size={22} color={colors.PrimaryBlue} />
            </View>
            <Text style={[styles.statValue, { color: colors.DarkText }]}>{totalItems}</Text>
            <Text style={[styles.statLabel, { color: colors.GrayText }]}>{t.totalItems}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.CardBg }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.Border },
              ]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.Background }]}>
                {renderIcon(item, 22, colors.PrimaryBlue)}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuLabel, { color: colors.DarkText }]}>{item.label}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.GrayText }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.GrayText} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoCard}>
          <Image
            source={require('../../assets/inventqry-icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.DarkText }]}>InventQRy</Text>
          <Text style={[styles.appVersion, { color: colors.GrayText }]}>{t.version} 1.0.0</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.CardBg, borderColor: colors.PrimaryBlue }]}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.7}
        >
          {loggingOut ? (
            <ActivityIndicator color={colors.PrimaryBlue} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={22} color={colors.PrimaryBlue} />
              <Text style={[styles.logoutText, { color: colors.PrimaryBlue }]}>{t.logout}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 40,
  },
  userCard: {
    alignItems: 'center',
    borderRadius: Radius.Card,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xl,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Radius.Card,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xxl,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
  menuCard: {
    borderRadius: Radius.Card,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
  appInfoCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  appIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  appName: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    marginBottom: 2,
  },
  appVersion: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.Button,
    height: 52,
    gap: 10,
    borderWidth: 1.5,
  },
  logoutText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
  },
});
