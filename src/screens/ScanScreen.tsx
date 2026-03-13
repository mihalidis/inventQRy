import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRScanner from '../components/QRScanner';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';
import { parseQRValue } from '../utils/qr';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfByQR } = useInventory();

  const handleScan = useCallback(
    (value: string) => {
      const qrValue = value.startsWith('inventqry://') ? value : `inventqry://shelf/${value}`;
      const shelf = getShelfByQR(qrValue);

      if (shelf) {
        navigation.navigate('ShelfDetail', { shelfId: shelf.id });
      } else {
        const shelfId = parseQRValue(qrValue);
        Alert.alert(
          'Shelf Not Found',
          shelfId
            ? `No shelf found for ID: ${shelfId}`
            : 'Invalid QR code format. Expected an InventQRy code.'
        );
      }
    },
    [getShelfByQR, navigation]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <QRScanner onScan={handleScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});
