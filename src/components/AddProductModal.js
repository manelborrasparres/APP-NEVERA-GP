import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PRODUCTOS_BASE } from '../constants/data';

export default function AddProductModal({ visible, onClose, filtroBusqueda, setFiltroBusqueda, neveraInventario, addProductToNevera, theme }) {
  const productosFiltrados = Object.values(PRODUCTOS_BASE).filter((p) => {
    const q = filtroBusqueda.toLowerCase();
    return p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlayModal}>
        <View style={[styles.contenidoModal, { backgroundColor: theme.card }]}>
          <View style={[styles.headerModal, { borderBottomColor: theme.border }]}>
            <Text style={[styles.tituloModal, { color: theme.text }]}>Añadir producto</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput 
            style={[styles.inputBusqueda, { borderColor: theme.border, color: theme.text }]}
            placeholder="Buscar por nombre o categoría..."
            placeholderTextColor={theme.textSecondary}
            value={filtroBusqueda}
            onChangeText={setFiltroBusqueda}
          />

          <ScrollView style={{ maxHeight: 300 }}>
            {productosFiltrados.length === 0 && <Text style={[styles.noResultados, { color: theme.textSecondary }]}>Sin resultados</Text>}
            {productosFiltrados.map((p) => (
              <TouchableOpacity key={p.id} style={[styles.itemFilaProducto, { borderBottomColor: theme.border }]} onPress={() => addProductToNevera(p.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nombreItemModal, { color: theme.text }]}>{p.nombre}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{p.categoria} · {p.tipo}</Text>
                </View>
                {neveraInventario[p.id] && <Text style={styles.tagYaEnNevera}>{neveraInventario[p.id]} listo</Text>}
                <Text style={styles.plusFilaModal}>+</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  inputBusqueda: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14 },
  noResultados: { textAlign: 'center', padding: 16 },
  itemFilaProducto: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  nombreItemModal: { fontSize: 15, fontWeight: '500' },
  tagYaEnNevera: { fontSize: 11, backgroundColor: '#e0f2fe', color: '#0369a1', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', marginRight: 8 },
  plusFilaModal: { fontSize: 20, color: '#3b82f6', fontWeight: 'bold', paddingHorizontal: 4 }
});