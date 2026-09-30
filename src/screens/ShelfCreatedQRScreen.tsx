import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useInventory } from '../hooks/useInventory';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { format } from '../i18n/translations';
import { RootStackParamList } from '../types/inventory';
import { Radius, Spacing, Typography } from '../constants/theme';

type ScreenRoute = RouteProp<RootStackParamList, 'ShelfCreatedQR'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShelfCreatedQRScreen() {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<NavigationProp>();
  const { getShelfById } = useInventory();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const shelf = getShelfById(route.params.shelfId);

  const handleDone = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
  };

  if (!shelf) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.Background }]}>
        <Text style={[styles.notFoundText, { color: colors.GrayText }]}>{t.shelfNotFound}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.Background }]}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={72} color={colors.SuccessGreen} />
        </View>

        <Text style={[styles.successTitle, { color: colors.DarkText }]}>{t.shelfCreated}</Text>
        <Text style={[styles.successSubtitle, { color: colors.GrayText }]}>
          {format(t.shelfCreatedSubtitle, { name: shelf.name })}
        </Text>

        {/* QR her zaman beyaz zeminde: yazdırma ve tarama güvenilirliği için */}
        <View style={[styles.qrCard, { borderColor: colors.Border, shadowColor: colors.DarkText }]}>
          <QRCode value={shelf.qrCode} size={200} color="#000000" backgroundColor="#FFFFFF" />
          <Text style={styles.qrLabel}>
            {shelf.name} · {shelf.location}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.PrimaryBlue }]}
            onPress={() => navigation.replace('PrintQR', { shelfId: shelf.id })}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="qrcode" size={18} color={colors.PrimaryBlue} />
            <Text style={[styles.secondaryBtnText, { color: colors.PrimaryBlue }]}>{t.printQR}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: colors.PrimaryBlue, shadowColor: colors.PrimaryBlue }]}
            onPress={handleDone}
            activeOpacity={0.7}
          >
            <Text style={styles.doneBtnText}>{t.done}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.Card,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  qrLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: '#2A3342',
    marginTop: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: Radius.Button,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  secondaryBtnText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.md,
  },
  doneBtn: {
    borderRadius: Radius.Button,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
    color: '#FFFFFF',
  },
});
