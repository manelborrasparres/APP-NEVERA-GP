import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navegarConCortina, screenWidth, theme }) {
  return (
    <View style={styles.centerContainer}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navegarConCortina('despensa')}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
      >
        <Text style={styles.cardEmoji}>📊</Text>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Calorías y Despensa</Text>
        <Text style={{ color: theme.textSecondary }}>Toca para ver tus calorías e ingredientes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navegarConCortina('nevera_inventario')}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
      >
        <Text style={styles.cardEmoji}>🧊</Text>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Gestionar Nevera</Text>
        <Text style={{ color: theme.textSecondary }}>Añade existencias reales o envíalas al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { alignItems: 'center' },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: 'center'
  },
  cardEmoji: { fontSize: 40, marginBottom: 8 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
});