import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ScanFrame from '../components/ScanFrame';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/inventory';
import { parseQRValue, generateQRValue } from '../utils/qr';
import { track } from '../services/analytics';
import { Radius, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { getShelfByQR, loading } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Sekmeden çıkınca el fenerini kapat
  useEffect(() => {
    if (!isFocused) setTorch(false);
  }, [isFocused]);

  const resetAfter = (ms: number) => setTimeout(() => setScanned(false), ms);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned || loading) return;
      setScanned(true);

      const data = result.data;
      const qrValue = data.startsWith('inventqry://') ? data : generateQRValue(data);
      const shelfId = parseQRValue(qrValue);

      if (!shelfId) {
        Alert.alert(t.invalidQRTitle, t.invalidQRDesc, [{ text: t.ok, onPress: () => setScanned(false) }]);
        return;
      }

      const shelf = getShelfByQR(qrValue);
      if (shelf) {
        track('qr_scanned');
        navigation.navigate('ShelfDetail', { shelfId: shelf.id });
        resetAfter(1500);
        return;
      }

      // Karar: kullanıcı yalnızca kendi raflarını görebilir; yabancı/silinmiş QR tek mesajla geçilir
      track('qr_scan_not_found');
      Alert.alert(t.qrNotYoursTitle, t.qrNotYoursDesc, [{ text: t.ok, onPress: () => setScanned(false) }]);
    },
    [scanned, loading, getShelfByQR, navigation, t]
  );

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.Background }]}>
        <ActivityIndicator color={colors.PrimaryBlue} />
        <Text style={[styles.statusText, { color: colors.GrayText }]}>{t.requestingCamera}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.Background }]}>
        <MaterialCommunityIcons name="camera-off" size={48} color={colors.GrayText} />
        <Text style={[styles.statusText, { color: colors.DarkText }]}>{t.cameraDenied}</Text>
        <Text style={[styles.subText, { color: colors.GrayText }]}>{t.cameraDeniedDesc}</Text>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.PrimaryBlue }]}
          onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsBtnText}>{t.openSettings}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Kamera yalnızca sekme görünürken çalışır; pil ve gizlilik için */}
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      )}

      <View style={styles.overlay}>
        <View style={[styles.overlayTop, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.title}>{t.scanTitle}</Text>
          <Text style={styles.subtitle}>{t.scanSubtitle}</Text>
        </View>

        <View style={styles.frameRow}>
          <View style={styles.overlaySide} />
          <ScanFrame />
          <View style={styles.overlaySide} />
        </View>

        <View style={styles.overlayBottom}>
          <View style={styles.statusBadge}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.PrimaryBlue} />
            ) : (
              <MaterialCommunityIcons name="qrcode-scan" size={18} color={colors.PrimaryBlue} />
            )}
            <Text style={styles.scanningText}>
              {loading ? t.lookingUp : scanned ? t.qrDetected : t.scanning}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.torchBtn, torch && { backgroundColor: colors.PrimaryBlue }]}
            onPress={() => setTorch((v) => !v)}
            accessibilityLabel={t.torch}
            activeOpacity={0.8}
          >
            <Ionicons name={torch ? 'flashlight' : 'flashlight-outline'} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  statusText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    marginTop: 12,
    textAlign: 'center',
  },
  subText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  settingsBtn: {
    marginTop: 20,
    borderRadius: Radius.Button,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  settingsBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: '#FFFFFF',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  overlayTop: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingBottom: 24,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xxl,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  frameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    height: '100%',
  },
  overlayBottom: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 120,
    gap: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  scanningText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: '#2A3342',
  },
  torchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
