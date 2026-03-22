import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Radius, Spacing, Typography } from '../../constants/theme';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!name.trim()) { setError(t.enterName); return; }
    if (!email.trim()) { setError(t.enterEmail); return; }
    if (!password) { setError(t.setPassword); return; }
    if (password.length < 6) { setError(t.weakPassword); return; }
    if (password !== confirmPassword) { setError(t.passwordMismatch); return; }

    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/inventqry-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.Background, borderColor: colors.Border }]}>
          <Text style={[styles.title, { color: colors.DarkText }]}>{t.createAccount}</Text>
          <Text style={[styles.subtitle, { color: colors.GrayText }]}>{t.registerSubtitle}</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={colors.Danger} />
              <Text style={[styles.errorText, { color: colors.Danger }]}>{error}</Text>
            </View>
          ) : null}

          <View style={[styles.inputContainer, { backgroundColor: colors.SecondaryWhite }]}>
            <Ionicons name="person-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.DarkText }]}
              placeholder={t.fullName}
              placeholderTextColor={colors.GrayText}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

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
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.SecondaryWhite }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.DarkText }]}
              placeholder={t.password}
              placeholderTextColor={colors.GrayText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.GrayText}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.SecondaryWhite }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.DarkText }]}
              placeholder={t.confirmPassword}
              placeholderTextColor={colors.GrayText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.GrayText}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.PrimaryBlue }, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>{t.createAccount}</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.loginText, { color: colors.GrayText }]}>
            {t.hasAccount} <Text style={[styles.loginTextBold, { color: colors.PrimaryBlue }]}>{t.login}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.ScreenPadding + 8,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  card: {
    borderRadius: Radius.Card,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xxl,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.Input,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    borderRadius: Radius.Button,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4A7BF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: '#FFFFFF',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  loginText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
  },
  loginTextBold: {
    fontFamily: Typography.fontFamily.bold,
  },
});
