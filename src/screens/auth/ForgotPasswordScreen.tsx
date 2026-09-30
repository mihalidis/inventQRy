import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../types/inventory';
import { Radius, Spacing, Typography } from '../../constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError('');
    if (!email.trim()) { setError(t.enterEmail); return; }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.Background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel={t.back}>
          <Ionicons name="arrow-back" size={24} color={colors.DarkText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.iconContainer, { backgroundColor: colors.CardBg }]}>
          <Ionicons name="key-outline" size={36} color={colors.PrimaryBlue} />
        </View>

        <Text style={[styles.title, { color: colors.DarkText }]}>{t.resetPasswordTitle}</Text>
        <Text style={[styles.subtitle, { color: colors.GrayText }]}>{t.resetPasswordSubtitle}</Text>

        {sent ? (
          <View style={[styles.successBox, { backgroundColor: colors.CardBg }]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.SuccessGreen} />
            <Text style={[styles.successText, { color: colors.DarkText }]}>{t.resetEmailSent}</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.Danger + '1A' }]}>
                <Ionicons name="alert-circle" size={18} color={colors.Danger} />
                <Text style={[styles.errorText, { color: colors.Danger }]}>{error}</Text>
              </View>
            ) : null}

            <View style={[styles.inputContainer, { backgroundColor: colors.SecondaryWhite }]}>
              <Ionicons name="mail-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.DarkText }]}
                placeholder={t.email}
                placeholderTextColor={colors.GrayText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.PrimaryBlue }, loading && styles.buttonDisabled]}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t.sendResetLink}</Text>}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={[styles.backLinkText, { color: colors.PrimaryBlue }]}>{t.backToLogin}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 8,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.ScreenPadding + 8,
    paddingTop: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xxl,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.Input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radius.Card,
    padding: 16,
    gap: 10,
  },
  successText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    flex: 1,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.Input,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    height: '100%',
  },
  button: {
    borderRadius: Radius.Button,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: '#FFFFFF',
  },
  backLink: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  backLinkText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
  },
});
