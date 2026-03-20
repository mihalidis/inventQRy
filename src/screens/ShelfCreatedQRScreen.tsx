import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'ShelfCreatedQR'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelfCreatedQRScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById } = useInventory();
  const shelf = getShelfById(route.params.shelfId);

  const handleDone = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  if (!shelf) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFoundText}>Shelf not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Checkmark */}
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.SuccessGreen} />
        </View>

        <Text style={styles.successTitle}>Raf Başarıyla Eklendi!</Text>
        <Text style={styles.successSubtitle}>
          "{shelf.name}" rafı oluşturuldu ve QR kodu hazır.
        </Text>

        {/* QR Code */}
        <View style={styles.qrCard}>
          <QRCode
            value={shelf.qrCode}
            size={200}
            color={Colors.DarkText}
            backgroundColor={Colors.Background}
          />
          <Text style={styles.qrLabel}>
            {shelf.name} - {shelf.location}
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={handleDone}
          activeOpacity={0.7}
        >
          <Text style={styles.doneBtnText}>Bitti</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.ScreenPadding,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.xl,
    color: Colors.DarkText,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.GrayText,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: Colors.Background,
    borderRadius: Radius.Card,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.Border,
    shadowColor: Colors.DarkText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  qrLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.DarkText,
    marginTop: 16,
    textAlign: 'center',
  },
  doneBtn: {
    backgroundColor: Colors.PrimaryBlue,
    borderRadius: Radius.Button,
    paddingVertical: 14,
    paddingHorizontal: 60,
    shadowColor: Colors.PrimaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
    color: Colors.Background,
  },
});
