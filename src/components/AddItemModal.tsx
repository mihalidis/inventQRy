import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Radius, Spacing, Typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { format } from '../i18n/translations';

interface AddItemModalProps {
  visible: boolean;
  shelfName: string;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

export default function AddItemModal({ visible, shelfName, onClose, onAdd }: AddItemModalProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetWrapper}
            >
              <View style={[styles.sheet, { backgroundColor: colors.Background }]}>
                <View style={[styles.handle, { backgroundColor: colors.Border }]} />
                <Text style={[styles.title, { color: colors.DarkText }]}>
                  {format(t.addItemTo, { shelf: shelfName })}
                </Text>

                <Text style={[styles.label, { color: colors.DarkText }]}>{t.itemName}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.InputBg, color: colors.DarkText }]}
                  value={name}
                  onChangeText={setName}
                  placeholder={t.itemNamePlaceholder}
                  placeholderTextColor={colors.GrayText}
                  autoFocus
                />

                <Text style={[styles.label, { color: colors.DarkText }]}>{t.description}</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.InputBg, color: colors.DarkText }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t.descriptionPlaceholder}
                  placeholderTextColor={colors.GrayText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: colors.PrimaryBlue }, !name.trim() && styles.addBtnDisabled]}
                  onPress={handleAdd}
                  disabled={!name.trim()}
                >
                  <Text style={styles.addBtnText}>{t.add}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.ScreenPadding,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    marginBottom: 16,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    marginBottom: 6,
  },
  input: {
    borderRadius: Radius.Input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 80,
  },
  addBtn: {
    borderRadius: Radius.Button,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.md,
    color: '#FFFFFF',
  },
});
