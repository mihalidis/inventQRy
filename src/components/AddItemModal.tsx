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
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface AddItemModalProps {
  visible: boolean;
  shelfName: string;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

export default function AddItemModal({ visible, shelfName, onClose, onAdd }: AddItemModalProps) {
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
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.title}>Eşya Ekle: {shelfName}</Text>

                <Text style={styles.label}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Item name"
                  placeholderTextColor={Colors.GrayText}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Description (optional)"
                  placeholderTextColor={Colors.GrayText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[styles.addBtn, !name.trim() && styles.addBtnDisabled]}
                  onPress={handleAdd}
                  disabled={!name.trim()}
                >
                  <Text style={styles.addBtnText}>Ekle</Text>
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
    backgroundColor: Colors.Background,
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
    backgroundColor: Colors.Border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: Colors.DarkText,
    marginBottom: 16,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.DarkText,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.InputBg,
    borderRadius: Radius.Input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.md,
    color: Colors.DarkText,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 80,
  },
  addBtn: {
    backgroundColor: Colors.PrimaryBlue,
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
    color: Colors.Background,
  },
});
