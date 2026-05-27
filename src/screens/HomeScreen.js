import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navegarConCortina, screenWidth, theme }) {
  return (
    <View style={styles.centerContainer}>
      
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navegarConCortina('despensa')}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
      >
        <View style={[styles.iconCircle, { backgroundColor: theme.orange + '15' }]}>
          <MaterialCommunityIcons name="chart-pie" size={32} color={theme.orange} />
        </View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Calorías y Despensa</Text>
        <Text style={[styles.cardSub, { color: theme.textSecondary }]}>Toca para ver tus calorías e ingredientes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navegarConCortina('nevera_inventario')}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
      >
        {/* LOGO SIMULADO OFICIAL MERCADONA */}
        <View style={[styles.logoMercadonaCircle, { backgroundColor: '#005e3a' }]}>
          <FontAwesome5 name="shopping-basket" size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.cardTitle, { color: theme.text, marginTop: 12 }]}>Gestionar Nevera</Text>
        <Text style={[styles.cardSub, { color: theme.textSecondary }]}>Añade existencias reales o envíalas al menú</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { alignItems: 'center', paddingTop: 8 },
  card: { padding: 24, borderRadius: 20, marginBottom: 16, borderWidth: 1, elevation: 3, alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  cardSub: { fontSize: 13, textAlign: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoMercadonaCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#ff6600', marginBottom: 4 }
});