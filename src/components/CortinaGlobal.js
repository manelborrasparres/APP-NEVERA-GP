import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function CortinaGlobal({ posicionCortina, screenHeight, escalaAnim, theme }) {
  return (
    <Animated.View style={[styles.cortina, { backgroundColor: theme.accent, top: posicionCortina, height: screenHeight }]}>
      <Animated.View style={{ transform: [{ scale: escalaAnim }] }}>
        <Text style={styles.textCortina}>MERCADONA</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cortina: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCortina: {
    color: 'white',
    fontWeight: '900',
    fontSize: 48,
    letterSpacing: 4
  },
});