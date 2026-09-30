import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FRAME_SIZE = SCREEN_WIDTH * 0.65;
const CORNER_LENGTH = 30;
const CORNER_WIDTH = 4;

export default function ScanFrame() {
  const { colors } = useTheme();
  const tint = { backgroundColor: colors.PrimaryBlue };

  return (
    <View style={styles.container}>
      {/* Top Left */}
      <View style={[styles.corner, styles.topLeft]}>
        <View style={[styles.horizontal, styles.top, styles.left, tint]} />
        <View style={[styles.vertical, styles.top, styles.left, tint]} />
      </View>
      {/* Top Right */}
      <View style={[styles.corner, styles.topRight]}>
        <View style={[styles.horizontal, styles.top, styles.right, tint]} />
        <View style={[styles.vertical, styles.top, styles.right, tint]} />
      </View>
      {/* Bottom Left */}
      <View style={[styles.corner, styles.bottomLeft]}>
        <View style={[styles.horizontal, styles.bottom, styles.left, tint]} />
        <View style={[styles.vertical, styles.bottom, styles.left, tint]} />
      </View>
      {/* Bottom Right */}
      <View style={[styles.corner, styles.bottomRight]}>
        <View style={[styles.horizontal, styles.bottom, styles.right, tint]} />
        <View style={[styles.vertical, styles.bottom, styles.right, tint]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
  },
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
  horizontal: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_WIDTH,
    borderRadius: 2,
  },
  vertical: {
    position: 'absolute',
    width: CORNER_WIDTH,
    height: CORNER_LENGTH,
    borderRadius: 2,
  },
  top: { top: 0 },
  bottom: { bottom: 0 },
  left: { left: 0 },
  right: { right: 0 },
});
