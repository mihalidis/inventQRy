import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Language } from '../i18n/translations';
import { Radius, Spacing, Typography } from '../constants/theme';

export default function AppPreferencesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { language, t, setLanguage } = useLanguage();
  const { mode, colors, setMode } = useTheme();
  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleThemeChange = async (themeMode: ThemeMode) => {
    await setMode(themeMode);
  };

  const languageOptions: { key: Language; label: string }[] = [
    { key: 'tr', label: t.turkish },
    { key: 'en', label: t.english },
  ];

  const themeOptions: { key: ThemeMode; label: string; icon: string }[] = [
    { key: 'light', label: t.lightTheme, icon: 'sunny-outline' },
    { key: 'dark', label: t.darkTheme, icon: 'moon-outline' },
    { key: 'system', label: t.systemTheme, icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.Background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.DarkText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.DarkText }]}>{t.appPreferences}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Section */}
        <Text style={[styles.sectionTitle, { color: colors.DarkText }]}>{t.language}</Text>
        <Text style={[styles.sectionDesc, { color: colors.GrayText }]}>{t.languageDesc}</Text>
        <View style={[styles.optionCard, { backgroundColor: colors.CardBg }]}>
          {languageOptions.map((opt, index) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionRow,
                index < languageOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.Border },
              ]}
              onPress={() => handleLanguageChange(opt.key)}
              activeOpacity={0.6}
            >
              <View style={[styles.optionIconBox, { backgroundColor: colors.Background }]}>
                <MaterialCommunityIcons
                  name={opt.key === 'tr' ? 'flag' : 'earth'}
                  size={20}
                  color={colors.PrimaryBlue}
                />
              </View>
              <Text style={[styles.optionLabel, { color: colors.DarkText }]}>{opt.label}</Text>
              {language === opt.key && (
                <Ionicons name="checkmark-circle" size={22} color={colors.PrimaryBlue} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Section */}
        <Text style={[styles.sectionTitle, { color: colors.DarkText }]}>{t.theme}</Text>
        <Text style={[styles.sectionDesc, { color: colors.GrayText }]}>{t.themeDesc}</Text>
        <View style={[styles.optionCard, { backgroundColor: colors.CardBg }]}>
          {themeOptions.map((opt, index) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionRow,
                index < themeOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.Border },
              ]}
              onPress={() => handleThemeChange(opt.key)}
              activeOpacity={0.6}
            >
              <View style={[styles.optionIconBox, { backgroundColor: colors.Background }]}>
                <Ionicons name={opt.icon as any} size={20} color={colors.PrimaryBlue} />
              </View>
              <Text style={[styles.optionLabel, { color: colors.DarkText }]}>{opt.label}</Text>
              {mode === opt.key && (
                <Ionicons name="checkmark-circle" size={22} color={colors.PrimaryBlue} />
              )}
            </TouchableOpacity>
          ))}
        </View>

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
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginBottom: 12,
  },
  optionCard: {
    borderRadius: Radius.Card,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
});
