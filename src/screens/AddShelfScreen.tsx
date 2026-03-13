import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StyledText from '../components/atoms/StyledText';
import { useInventory } from '../hooks/useInventory';
import { RootStackParamList } from '../types/inventory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddShelfScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addShelf } = useInventory();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const isValid = name.trim().length > 0 && location.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    const shelf = addShelf(name.trim(), location.trim());
    navigation.replace('ShelfDetail', { shelfId: shelf.id });
  }, [isValid, name, location, addShelf, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <StyledText weight={600} style={styles.icon}>📦</StyledText>
        </View>
        <StyledText weight={600} style={styles.heading}>
          Create a New Shelf
        </StyledText>
        <StyledText style={styles.subheading}>
          Give your shelf a name and location. A QR code will be generated automatically.
        </StyledText>

        <View style={styles.field}>
          <StyledText weight={500} style={styles.label}>Shelf Name</StyledText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kitchen Cabinet"
            placeholderTextColor="#B0B5BD"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.field}>
          <StyledText weight={500} style={styles.label}>Location</StyledText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kitchen, 2nd Floor"
            placeholderTextColor="#B0B5BD"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          activeOpacity={0.7}
        >
          <StyledText weight={600} style={styles.buttonText}>
            Create Shelf
          </StyledText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  heading: {
    fontSize: 22,
    color: '#2A3342',
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    color: '#8E9196',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#2A3342',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2A3342',
    fontFamily: 'SometypeMono-Regular',
  },
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#4A7BF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
