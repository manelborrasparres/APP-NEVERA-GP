import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function Header({ 
  currentScreen, navegarConCortina, isDarkMode, setIsDarkMode, theme, onLogout, 
  isMuted, onToggleSonido, userEmail = "usuario@mercadona.es" 
}) {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const headerIconColor = isDarkMode ? theme.text : '#FFFFFF';

  return (
    <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
      {currentScreen !== 'home' ? (
        <TouchableOpacity onPress={() => navegarConCortina('home')}>
          <Ionicons name="arrow-back" size={24} color={headerIconColor} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Feather name="user" size={24} color={headerIconColor} />
        </TouchableOpacity>
      )}

      <Text style={[styles.title, { color: isDarkMode ? theme.text : '#FFFFFF' }]}>
        {currentScreen === 'home' ? 'NEVERITA MERCADONA' : currentScreen === 'despensa' ? 'Mi Despensa' : 'Mi Nevera'}
      </Text>

      {/* Contenedor derecho para agrupar los botones de utilidades */}
      <View style={styles.rightActionsContainer}>
        {/* NUEVO BOTÓN: CONTROL DE MÚSICA .M4A */}
        <TouchableOpacity onPress={onToggleSonido} style={styles.actionButton}>
          <Ionicons 
            name={isMuted ? "volume-mute-outline" : "volume-high-outline"} 
            size={24} 
            color={headerIconColor} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.actionButton}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={headerIconColor} />
        </TouchableOpacity>
      </View>

      {/* ================= MODAL PERFIL ================= */}
      <Modal visible={profileModalVisible} transparent={true} animationType="fade" onRequestClose={() => setProfileModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setProfileModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.popoverContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.popoverHeader}>
                  <Feather name="user" size={20} color={theme.text} />
                  <Text style={[styles.popoverTitle, { color: theme.text }]}>Mi Cuenta</Text>
                </View>
                <Text style={[styles.emailText, { color: theme.textSecondary }]}>{userEmail}</Text>
                <View style={[styles.separator, { backgroundColor: theme.border }]} />
                <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={() => { setProfileModalVisible(false); onLogout(); }}
                >
                  <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                  <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    zIndex: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center', paddingHorizontal: 8 },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  popoverContainer: { position: 'absolute', top: 65, left: 15, width: 240, borderRadius: 12, borderWidth: 1, padding: 16, elevation: 5 },
  popoverHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  popoverTitle: { fontSize: 16, fontWeight: 'bold' },
  emailText: { fontSize: 13, marginLeft: 28 },
  separator: { height: 1, marginVertical: 12 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, marginLeft: 4 },
  logoutButtonText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
});