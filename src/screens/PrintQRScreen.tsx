import React, { useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { format } from '../i18n/translations';
import { track } from '../services/analytics';
import { RootStackParamList } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'PrintQR'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrintQRScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();
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
        track('qr_shared');
      } else {
        Alert.alert(t.printQR, format(t.savedTo, { path: uri }));
      }
    } catch {
      Alert.alert(t.error, t.exportFailed);
    } finally {
      setSaving(false);
    }
  }, [t]);

  if (!shelf) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.Background }]}>
        <Text style={[styles.notFoundText, { color: colors.GrayText }]}>{t.shelfNotFound}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <Header showBack title={t.printQR} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Dışa aktarılan görsel: tema ne olursa olsun beyaz zemin, siyah QR */}
        <View
          ref={qrRef}
          style={[styles.qrCard, { borderColor: colors.Border, shadowColor: colors.DarkText }]}
          collapsable={false}
        >
          <QRCode value={shelf.qrCode} size={220} color="#000000" backgroundColor="#FFFFFF" />
          <Text style={styles.shelfLabel}>
            {format(t.qrLabel, { name: shelf.name, location: shelf.location })}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.shareBtn,
            { backgroundColor: colors.PrimaryBlue, shadowColor: colors.PrimaryBlue },
            saving && styles.shareBtnDisabled,
          ]}
          onPress={handleExport}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>{saving ? t.exporting : t.shareOrSave}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
  },
  content: {
    padding: Spacing.ScreenPadding,
    alignItems: 'center',
    paddingTop: 32,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.Card,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  shelfLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    color: '#2A3342',
    marginTop: 20,
    textAlign: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.Button,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 32,
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
    color: '#FFFFFF',
  },
});
