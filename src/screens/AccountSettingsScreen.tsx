import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Radius, Spacing, Typography } from '../constants/theme';

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { user, updateDisplayName, deleteAccount } = useAuth();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [name, setName] = useState(user?.displayName ?? '');
  const [savingName, setSavingName] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const nameChanged = name.trim().length > 0 && name.trim() !== (user?.displayName ?? '');

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await updateDisplayName(name.trim());
      Alert.alert(t.accountSettings, t.nameUpdated);
    } catch (err: any) {
      Alert.alert(t.error, err.message);
    } finally {
      setSavingName(false);
    }
  };

  const handleDelete = async () => {
    if (!password) { setDeleteError(t.enterPassword); return; }
    setDeleteError('');
    setDeleting(true);
    try {
      await deleteAccount(password);
      // Hesap silinince onAuthStateChanged tetiklenir, AppNavigator giriş ekranına döner
    } catch (err: any) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal(false);
    setPassword('');
    setDeleteError('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={t.accountSettings} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Görünen ad */}
        <Text style={[styles.sectionTitle, { color: colors.DarkText }]}>{t.displayName}</Text>
        <View style={[styles.card, { backgroundColor: colors.CardBg }]}>
          <View style={[styles.inputContainer, { backgroundColor: colors.Background }]}>
            <Ionicons name="person-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.DarkText }]}
              value={name}
              onChangeText={setName}
              placeholder={t.fullName}
              placeholderTextColor={colors.GrayText}
              autoCapitalize="words"
            />
          </View>
          <Text style={[styles.emailText, { color: colors.GrayText }]}>{user?.email}</Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.PrimaryBlue },
              (!nameChanged || savingName) && styles.buttonDisabled,
            ]}
            onPress={handleSaveName}
            disabled={!nameChanged || savingName}
            activeOpacity={0.8}
          >
            {savingName ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t.updateName}</Text>}
          </TouchableOpacity>
        </View>

        {/* Tehlikeli bölge */}
        <Text style={[styles.sectionTitle, { color: colors.Danger }]}>{t.dangerZone}</Text>
        <View style={[styles.card, { backgroundColor: colors.CardBg, borderColor: colors.Danger + '55', borderWidth: 1 }]}>
          <Text style={[styles.dangerDesc, { color: colors.GrayText }]}>{t.deleteAccountDesc}</Text>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton, { borderColor: colors.Danger }]}
            onPress={() => setDeleteModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color={colors.Danger} />
            <Text style={[styles.dangerButtonText, { color: colors.Danger }]}>{t.deleteAccount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Şifre onay modalı */}
      <Modal visible={deleteModal} transparent animationType="fade" onRequestClose={closeDeleteModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.Background }]}>
            <Ionicons name="warning-outline" size={40} color={colors.Danger} style={{ alignSelf: 'center' }} />
            <Text style={[styles.modalTitle, { color: colors.DarkText }]}>{t.deleteAccountConfirmTitle}</Text>
            <Text style={[styles.modalMessage, { color: colors.GrayText }]}>{t.deleteAccountConfirmMessage}</Text>

            {deleteError ? (
              <Text style={[styles.modalError, { color: colors.Danger }]}>{deleteError}</Text>
            ) : null}

            <View style={[styles.inputContainer, { backgroundColor: colors.SecondaryWhite }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.GrayText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.DarkText }]}
                value={password}
                onChangeText={setPassword}
                placeholder={t.enterPasswordToConfirm}
                placeholderTextColor={colors.GrayText}
                secureTextEntry
                autoCapitalize="none"
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.Danger }, deleting && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={deleting}
              activeOpacity={0.8}
            >
              {deleting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t.deleteAccountButton}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeDeleteModal} disabled={deleting}>
              <Text style={[styles.cancelText, { color: colors.GrayText }]}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.ScreenPadding,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: Radius.Card,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.Input,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    height: '100%',
  },
  emailText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginBottom: 14,
    marginLeft: 4,
  },
  button: {
    flexDirection: 'row',
    borderRadius: Radius.Button,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
    color: '#FFFFFF',
  },
  dangerDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    marginBottom: 14,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  dangerButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: Spacing.ScreenPadding + 8,
  },
  modalCard: {
    borderRadius: Radius.Card + 4,
    padding: 24,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  modalError: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  cancelText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
  },
});
