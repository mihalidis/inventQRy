import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../i18n/translations';
import { Radius, Spacing, Typography } from '../constants/theme';

const NOTIF_STORAGE_KEY = '@inventqry_notifications';

export default function AppPreferencesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { language, t, setLanguage } = useLanguage();
  const { mode, colors, setMode } = useTheme();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_STORAGE_KEY).then((val) => {
      setNotificationsEnabled(val === 'true');
    });
  }, []);

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleThemeChange = async (themeMode: ThemeMode) => {
    await setMode(themeMode);
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(t.notifications, t.notificationPermDenied);
        return;
      }

      setNotificationsEnabled(true);
      await AsyncStorage.setItem(NOTIF_STORAGE_KEY, 'true');

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        // Token could be saved to Firestore if configured
        console.log('Push token:', tokenData.data);
      } catch (err) {
        console.log('Token error:', err);
      }
    } else {
      setNotificationsEnabled(false);
      await AsyncStorage.setItem(NOTIF_STORAGE_KEY, 'false');
    }
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

        {/* Notifications Section */}
        <Text style={[styles.sectionTitle, { color: colors.DarkText }]}>{t.notifications}</Text>
        <Text style={[styles.sectionDesc, { color: colors.GrayText }]}>{t.notificationsDesc}</Text>
        <View style={[styles.optionCard, { backgroundColor: colors.CardBg }]}>
          <View style={styles.switchRow}>
            <View style={[styles.optionIconBox, { backgroundColor: colors.Background }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.PrimaryBlue} />
            </View>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.optionLabel, { color: colors.DarkText }]}>{t.pushNotifications}</Text>
              <Text style={[styles.switchDesc, { color: colors.GrayText }]}>{t.pushNotificationsDesc}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.Border, true: colors.PrimaryBlue }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
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
