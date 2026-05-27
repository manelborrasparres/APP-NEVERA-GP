import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProductDetailsModal({ producto, onClose, theme }) {
  if (!producto) return null;

  return (
    <Modal visible={producto !== null} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlayModal}>
        <View style={[styles.contenidoModal, { backgroundColor: theme.card, paddingBottom: 24 }]}>
          <View style={[styles.headerModal, { borderBottomColor: theme.border }]}>
            <Text style={[styles.tituloModal, { color: theme.text }]}>{producto.nombre}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalFilaInfo}>
            <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Categoría</Text>
            <Text style={styles.modalBadge}>{producto.categoria}</Text>
          </View>
          <View style={styles.modalFilaInfo}>
            <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Unidad de medida</Text>
            <Text style={{ color: theme.text }}>{producto.tipo}</Text>
          </View>
          <View style={styles.modalFilaInfo}>
            <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Calorías Base</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{producto.calorias} kcal</Text>
          </View>
          <View style={styles.modalFilaInfo}>
            <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Proteínas</Text>
            <Text style={{ color: theme.text }}>{producto.proteinas}</Text>
          </View>

          <Text style={[styles.descripcionProductoModal, { color: theme.text, backgroundColor: theme.itemHistoryBg }]}>
            {producto.descripcion}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  contenidoModal: { width: '100%', borderRadius: 16, padding: 16, elevation: 5 },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, marginBottom: 12 },
  tituloModal: { fontSize: 18, fontWeight: 'bold' },
  modalFilaInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  modalLabelInfo: { fontSize: 14 },
  modalBadge: { backgroundColor: '#3b82f6', color: 'white', fontSize: 12, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden' },
  descripcionProductoModal: { marginTop: 16, padding: 12, borderRadius: 8, fontSize: 13, fontStyle: 'italic', lineHeight: 18 }
});