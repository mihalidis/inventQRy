import React, { useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Header from '../components/Header';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'PrintQR'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrintQRScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById } = useInventory();
  const shelf = getShelfById(route.params.shelfId);
  const qrRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);

  const handleExport = useCallback(async () => {
    if (!qrRef.current) return;
    setSaving(true);
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 1 });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Saved', `QR code saved to: ${uri}`);
      }
    } catch {
      Alert.alert('Error', 'Failed to export QR code');
    } finally {
      setSaving(false);
    }
  }, []);

  if (!shelf) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFoundText}>Shelf not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        showBack
        title="Print QR"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View ref={qrRef} style={styles.qrCard} collapsable={false}>
          <QRCode
            value={shelf.qrCode}
            size={220}
            color={Colors.DarkText}
            backgroundColor={Colors.Background}
          />
          <Text style={styles.shelfLabel}>Raf: {shelf.name}, {shelf.location}</Text>
        </View>

        <TouchableOpacity
          style={[styles.shareBtn, saving && styles.shareBtnDisabled]}
          onPress={handleExport}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.shareBtnText}>
            {saving ? 'Exporting...' : 'Paylaş / Kaydet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    color: Colors.GrayText,
  },
  content: {
    padding: Spacing.ScreenPadding,
    alignItems: 'center',
    paddingTop: 32,
  },
  qrCard: {
    backgroundColor: Colors.Background,
    borderRadius: Radius.Card,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.Border,
    shadowColor: Colors.DarkText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  shelfLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    color: Colors.DarkText,
    marginTop: 20,
    textAlign: 'center',
  },
  shareBtn: {
    backgroundColor: Colors.PrimaryBlue,
    borderRadius: Radius.Button,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 32,
    shadowColor: Colors.PrimaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnDisabled: {
    opacity: 0.6,
  },
  shareBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
    color: Colors.Background,
  },
});
