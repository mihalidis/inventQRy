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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddShelfScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addShelf } = useInventory();

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
      setLoading(false);
    }
  }, [isValid, loading, name, location, addShelf, navigation]);

  return (
    <View style={styles.container}>
      <Header
        showBack
        title="Yeni Raf Oluştur"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={40}
              color={Colors.PrimaryBlue}
            />
          </View>

          <Text style={styles.heading}>Yeni Raf Oluştur</Text>
          <Text style={styles.subheading}>
            Rafınıza bir isim ve konum verin. QR kodu otomatik oluşturulacak.
          </Text>

          <Text style={styles.label}>Raf Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="örn: Kitaplık"
            placeholderTextColor={Colors.GrayText}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>Konum</Text>
          <TextInput
            style={styles.input}
            placeholder="örn: Salon, 2. Kat"
            placeholderTextColor={Colors.GrayText}
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Oluştur</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  content: {
    padding: Spacing.ScreenPadding,
    paddingTop: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.SecondaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  heading: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xl,
    color: Colors.DarkText,
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.DarkText,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: Radius.Input,
    backgroundColor: Colors.InputBg,
    paddingHorizontal: 16,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    color: Colors.DarkText,
    marginBottom: 20,
  },
  button: {
    height: 52,
    borderRadius: Radius.Button,
    backgroundColor: Colors.PrimaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.PrimaryBlue,
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
    color: Colors.Background,
    fontSize: Typography.sizes.md,
  },
});
