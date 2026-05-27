import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRODUCTOS_BASE, FOOD_TYPES, OPCIONES_CANTIDAD } from '../constants/data';

export default function NeveraScreen({ 
  neveraInventario, tarjetaExpandidaId, setTarjetaExpandidaId, 
  cantidadSeleccionada, setCantidadSeleccionada, setModalAddVisible, 
  setProductoActivo, handleEnviarACalorias, theme 
}) {
  return (
    <View style={styles.content}>
      <TouchableOpacity style={styles.btnAgregarNevera} onPress={() => setModalAddVisible(true)}>
        <Text style={styles.btnAgregarNeveraText}>+ Añadir productos a la Nevera</Text>
      </TouchableOpacity>

      {Object.keys(neveraInventario).length === 0 ? (
        <View style={styles.emptyStateNative}>
          <Text style={styles.emptyIcon}>🧊</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Tu nevera está vacía</Text>
          <Text style={{ color: theme.textSecondary }}>Añade stock para empezar a procesar.</Text>
        </View>
      ) : (
        Object.entries(neveraInventario).map(([id, cantidad]) => {
          const prod = PRODUCTOS_BASE[id];
          if (!prod) return null;
          const isExpanded = tarjetaExpandidaId === id;

          return (
            <View key={id} style={[styles.cardNeveraWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity style={styles.cardNeveraPrincipal} onPress={() => setProductoActivo(prod)}>
                <View style={[styles.ingredientDot, { backgroundColor: FOOD_TYPES[prod.tipoFood]?.color || '#3b82f6' }]} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.prodName, { color: theme.text }]}>{prod.nombre}</Text>
                  <Text style={{ color: theme.textSecondary }}>{cantidad} {prod.tipo}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.expandBtn} 
                  onPress={() => {
                    setTarjetaExpandidaId(isExpanded ? null : id);
                    setCantidadSeleccionada(OPCIONES_CANTIDAD[prod.tipo][0]);
                  }}
                >
                  <Text style={[styles.expandBtnText, { color: theme.text }]}>{isExpanded ? '▼' : '▶'}</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.panelExpandido, { borderTopColor: theme.border }]}>
                  <Text style={[styles.labelPanel, { color: theme.text }]}>Seleccionar cantidad a gastar ({prod.tipo}):</Text>
                  <View style={styles.contenedorOpcionesBotones}>
                    {OPCIONES_CANTIDAD[prod.tipo].map((opt) => (
                      <TouchableOpacity 
                        key={opt} 
                        style={[styles.botonOpt, cantidadSeleccionada === opt ? styles.botonOptActivo : { borderColor: theme.border }]}
                        onPress={() => setCantidadSeleccionada(opt)}
                      >
                        <Text style={[styles.textBotonOpt, cantidadSeleccionada === opt ? styles.textBotonOptActivo : { color: theme.text }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity 
                    style={styles.btnEnviarCaloriasAccion}
                    onPress={() => {
                      if (cantidadSeleccionada > cantidad) {
                        alert('No tienes suficiente cantidad en la nevera física.');
                        return;
                      }
                      handleEnviarACalorias(id, cantidadSeleccionada);
                    }}
                  >
                    <Text style={styles.btnEnviarCaloriasAccionText}>Enviar a Despensa de Calorías</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  btnAgregarNevera: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 8 },
  btnAgregarNeveraText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyStateNative: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 8, opacity: 0.5 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  cardNeveraWrap: { borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden', elevation: 1 },
  cardNeveraPrincipal: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  ingredientDot: { width: 12, height: 12, borderRadius: 6 },
  prodName: { fontSize: 16, fontWeight: 'bold' },
  expandBtn: { padding: 8 },
  expandBtnText: { fontSize: 14 },
  panelExpandido: { padding: 16, borderTopWidth: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
  labelPanel: { fontSize: 13, marginBottom: 8, fontWeight: '500' },
  contenedorOpcionesBotones: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  botonOpt: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1 },
  botonOptActivo: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  textBotonOpt: { fontSize: 13 },
  textBotonOptActivo: { color: 'white', fontWeight: 'bold' },
  btnEnviarCaloriasAccion: { backgroundColor: '#10b981', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnEnviarCaloriasAccionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});