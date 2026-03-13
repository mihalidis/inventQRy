import React, { useRef, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import StyledText from '../components/atoms/StyledText';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';

type ScreenRoute = RouteProp<RootStackParamList, 'PrintQR'>;

export default function PrintQRScreen() {
  const route = useRoute<ScreenRoute>();
  const { getShelfById } = useInventory();
  const shelf = getShelfById(route.params.shelfId);
  const qrRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);

  const handleExport = useCallback(async () => {
    if (!qrRef.current) return;
    setSaving(true);
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Saved', `QR code saved to: ${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export QR code');
    } finally {
      setSaving(false);
    }
  }, []);

  if (!shelf) {
    return (
      <View style={styles.centered}>
        <StyledText weight={500} style={styles.notFound}>Shelf not found</StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View ref={qrRef} style={styles.qrContainer} collapsable={false}>
          <StyledText weight={600} style={styles.shelfName}>
            {shelf.name}
          </StyledText>
          <StyledText style={styles.shelfLocation}>
            {shelf.location}
          </StyledText>
          <View style={styles.qrWrapper}>
            <QRCode
              value={shelf.qrCode}
              size={200}
              color="#2A3342"
              backgroundColor="#FFFFFF"
            />
          </View>
          <StyledText style={styles.qrValue}>{shelf.qrCode}</StyledText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.exportButton, saving && styles.exportDisabled]}
        onPress={handleExport}
        disabled={saving}
        activeOpacity={0.7}
      >
        <StyledText weight={600} style={styles.exportText}>
          {saving ? 'Exporting...' : 'Export QR Code'}
        </StyledText>
      </TouchableOpacity>

      <StyledText style={styles.hint}>
        Print this QR code and attach it to your shelf, box, or cabinet.
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 24,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  notFound: {
    fontSize: 16,
    color: '#8E9196',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    shadowColor: '#2A3342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  shelfName: {
    fontSize: 20,
    color: '#2A3342',
    marginBottom: 4,
  },
  shelfLocation: {
    fontSize: 13,
    color: '#8E9196',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    borderRadius: 12,
    marginBottom: 16,
  },
  qrValue: {
    fontSize: 11,
    color: '#B0B5BD',
    textAlign: 'center',
  },
  exportButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#4A7BF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  exportDisabled: {
    opacity: 0.6,
  },
  exportText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#8E9196',
    textAlign: 'center',
    marginTop: 16,
  },
});
