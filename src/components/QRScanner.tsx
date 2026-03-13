import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import StyledText from './atoms/StyledText';

interface QRScannerProps {
  onScan: (value: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onScan(trimmed);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <StyledText weight={600} style={styles.icon}>
          ⎕
        </StyledText>
      </View>
      <StyledText weight={600} style={styles.title}>
        Scan QR Code
      </StyledText>
      <StyledText style={styles.subtitle}>
        Camera scanning coming soon. For now, enter or paste the QR code value below.
      </StyledText>
      <TextInput
        style={styles.input}
        placeholder="Enter QR code value..."
        placeholderTextColor="#B0B5BD"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, !input.trim() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!input.trim()}
        activeOpacity={0.7}
      >
        <StyledText weight={600} style={styles.buttonText}>
          Look Up
        </StyledText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 36,
    color: '#4A7BF7',
  },
  title: {
    fontSize: 20,
    color: '#2A3342',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E9196',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2A3342',
    backgroundColor: '#FFFFFF',
    fontFamily: 'SometypeMono-Regular',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4A7BF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});
