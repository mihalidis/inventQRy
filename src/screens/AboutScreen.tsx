import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Radius, Spacing, Typography } from '../constants/theme';

// Gizlilik politikası yayımlanınca .env'e eklenir; yoksa satır gösterilmez
const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;

export default function AboutScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const version = Constants.expoConfig?.version ?? '';

  const links = [
    PRIVACY_URL
      ? { icon: 'shield-checkmark-outline' as const, label: t.privacyPolicy, onPress: () => Linking.openURL(PRIVACY_URL) }
      : null,
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[];

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={t.about} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../assets/inventqry-icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.appName, { color: colors.DarkText }]}>{t.appName}</Text>
        <Text style={[styles.version, { color: colors.GrayText }]}>
          {t.version} {version}
        </Text>
        <Text style={[styles.desc, { color: colors.GrayText }]}>{t.aboutAppDesc}</Text>

        {links.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.CardBg }]}>
            {links.map((link, index) => (
              <TouchableOpacity
                key={link.label}
                style={[
                  styles.row,
                  index < links.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.Border },
                ]}
                onPress={link.onPress}
                activeOpacity={0.6}
              >
                <Ionicons name={link.icon} size={20} color={colors.PrimaryBlue} />
                <Text style={[styles.rowLabel, { color: colors.DarkText }]}>{link.label}</Text>
                <Ionicons name="open-outline" size={18} color={colors.GrayText} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.footer, { color: colors.GrayText }]}>{t.madeWith}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.ScreenPadding,
    paddingTop: 24,
    paddingBottom: 40,
  },
  logo: { width: 96, height: 96, marginBottom: 12 },
  appName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xl,
  },
  version: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
    marginBottom: 16,
  },
  desc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  card: {
    alignSelf: 'stretch',
    borderRadius: Radius.Card,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
  },
  footer: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    marginTop: 32,
  },
});
