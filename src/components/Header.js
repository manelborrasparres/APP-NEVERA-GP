import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function Header({ currentScreen, navegarConCortina, isDarkMode, setIsDarkMode, theme }) {
  return (
    <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
      {currentScreen !== 'home' ? (
        <TouchableOpacity onPress={() => navegarConCortina('home')}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Feather name="user" size={24} color={theme.text} />
        </TouchableOpacity>
      )}

      <Text style={[styles.title, { color: theme.text }]}>
        {currentScreen === 'home' ? 'NEVERITA MERCADONA' : currentScreen === 'despensa' ? 'Mi Despensa' : 'Mi Nevera'}
      </Text>

      <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
        <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
});