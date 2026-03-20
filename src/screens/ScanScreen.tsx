import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScanFrame from '../components/ScanFrame';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';
import { parseQRValue } from '../utils/qr';
import { Colors, Typography } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfByQR } = useInventory();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned) return;
      setScanned(true);

      const data = result.data;
      const qrValue = data.startsWith('inventqry://') ? data : `inventqry://shelf/${data}`;
      const shelf = getShelfByQR(qrValue);

      if (shelf) {
        navigation.navigate('ShelfDetail', { shelfId: shelf.id });
      } else {
        const shelfId = parseQRValue(qrValue);
        if (shelfId) {
          Alert.alert(
            'QR Detected',
            'This shelf is not registered yet. Would you like to create it?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
              {
                text: 'Create Shelf',
                onPress: () => navigation.navigate('AddShelf'),
              },
            ]
          );
        } else {
          Alert.alert('Invalid QR', 'This QR code is not an InventQRy code.', [
            { text: 'OK', onPress: () => setScanned(false) },
          ]);
        }
      }

      setTimeout(() => setScanned(false), 3000);
    },
    [scanned, getShelfByQR, navigation]
  );

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialCommunityIcons name="camera-off" size={48} color={Colors.GrayText} />
        <Text style={styles.statusText}>Camera permission denied</Text>
        <Text style={styles.subText}>Please enable camera access in Settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Dark overlay with cutout effect */}
      <View style={styles.overlay}>
        <View style={[styles.overlayTop, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.title}>Scan QR</Text>
          <Text style={styles.subtitle}>
            Point your camera at a shelf QR code
          </Text>
        </View>

        <View style={styles.frameRow}>
          <View style={styles.overlaySide} />
          <ScanFrame />
          <View style={styles.overlaySide} />
        </View>

        <View style={styles.overlayBottom}>
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons name="qrcode-scan" size={18} color={Colors.PrimaryBlue} />
            <Text style={styles.scanningText}>
              {scanned ? 'QR Detected!' : 'Scanning...'}
            </Text>
          </View>
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
    backgroundColor: Colors.Background,
  },
  statusText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.md,
    color: Colors.GrayText,
    marginTop: 12,
  },
  subText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    marginTop: 4,
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
    color: Colors.Background,
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
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  scanningText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.DarkText,
  },
});
