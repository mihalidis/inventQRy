import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddShelfScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addShelf } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = name.trim().length > 0 && location.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const shelfId = await addShelf(name.trim(), location.trim());
      navigation.replace('ShelfCreatedQR', { shelfId });
    } catch {
      Alert.alert(t.error, t.createShelfFailed);
      setLoading(false);
    }
  }, [isValid, loading, name, location, addShelf, navigation, t]);

  const inputStyle = [styles.input, { backgroundColor: colors.InputBg, color: colors.DarkText }];

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={t.createNewShelf} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.iconContainer, { backgroundColor: colors.CardBg }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={40} color={colors.PrimaryBlue} />
          </View>

          <Text style={[styles.heading, { color: colors.DarkText }]}>{t.createNewShelf}</Text>
          <Text style={[styles.subheading, { color: colors.GrayText }]}>{t.createShelfSubtitle}</Text>

          <Text style={[styles.label, { color: colors.DarkText }]}>{t.shelfName}</Text>
          <TextInput
            style={inputStyle}
            placeholder={t.shelfNamePlaceholder}
            placeholderTextColor={colors.GrayText}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="next"
          />

          <Text style={[styles.label, { color: colors.DarkText }]}>{t.shelfLocation}</Text>
          <TextInput
            style={inputStyle}
            placeholder={t.shelfLocationPlaceholder}
            placeholderTextColor={colors.GrayText}
            value={location}
            onChangeText={setLocation}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.PrimaryBlue, shadowColor: colors.PrimaryBlue },
              (!isValid || loading) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || loading}
            activeOpacity={0.7}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{t.create}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.ScreenPadding,
    paddingTop: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  heading: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xl,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
    lineHeight: 20,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: Radius.Input,
    paddingHorizontal: 16,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    marginBottom: 20,
  },
  button: {
    height: 52,
    borderRadius: Radius.Button,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
  },
});
