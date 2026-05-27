import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Feather, Ionicons } from '@expo/vector-icons';

// --- CONFIGURACIÓN DE TIPOS DE ALIMENTOS ---
const FOOD_TYPES = {
  proteina: { label: 'Proteína', color: '#ef4444' },
  carbohidrato: { label: 'Carbohidrato', color: '#f59e0b' },
  verdura: { label: 'Verdura', color: '#10b981' },
  fruta: { label: 'Fruta', color: '#8b5cf6' },
  lacteo: { label: 'Lácteo', color: '#3b82f6' },
  grasa: { label: 'Grasa', color: '#ec4899' },
  bebida: { label: 'Bebida', color: '#06b6d4' },
  otro: { label: 'Otro', color: '#6b7280' },
};

// --- BASE DE DATOS DE PRODUCTOS DISPONIBLES (Simulando products.js) ---
const PRODUCTOS_BASE = {
  '1': { id: '1', nombre: 'Pollo', calorias: 450, proteinas: '31g', categoria: 'Proteína', tipo: 'gramos', tipoFood: 'proteina', descripcion: 'Pechuga de pollo fresca, ideal para plancha.' },
  '2': { id: '2', nombre: 'Arroz', calorias: 350, proteinas: '7g', categoria: 'Carbohidrato', tipo: 'gramos', tipoFood: 'carbohidrato', descripcion: 'Arroz blanco de grano largo.' },
  '3': { id: '3', nombre: 'Brócoli', calorias: 55, proteinas: '2.8g', categoria: 'Verdura', tipo: 'gramos', tipoFood: 'verdura', descripcion: 'Rico en vitaminas y fibra.' },
  '4': { id: '4', nombre: 'Manzana', calorias: 95, proteinas: '0.3g', categoria: 'Fruta', tipo: 'unidades', tipoFood: 'fruta', descripcion: 'Manzana macedonia crujiente.' },
  '5': { id: '5', nombre: 'Leche', calorias: 150, proteinas: '8g', categoria: 'Lácteo', tipo: 'litros', tipoFood: 'lacteo', descripcion: 'Leche entera pasteurizada.' },
  '6': { id: '6', nombre: 'Aguacate', calorias: 240, proteinas: '2g', categoria: 'Grasa', tipo: 'unidades', tipoFood: 'grasa', descripcion: 'Grasas saludables y textura cremosa.' },
};

const OPCIONES_CANTIDAD = {
  litros: [0.25, 0.5, 1, 2],
  gramos: [100, 250, 500, 1000],
  unidades: [1, 2, 6, 12],
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'despensa' o 'nevera_inventario'
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // --- ESTADOS DE LA NEVERA E INGREDIENTES ---
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Pollo', calories: 450, type: 'proteina' },
    { id: '2', name: 'Arroz', calories: 350, type: 'carbohidrato' },
    { id: '3', name: 'Brócoli', calories: 55, type: 'verdura' },
    { id: '4', name: 'Manzana', calories: 95, type: 'fruta' },
    { id: '5', name: 'Leche', calories: 150, type: 'lacteo' },
    { id: '6', name: 'Aguacate', calories: 240, type: 'grasa' },
  ]);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [consumedHistory, setConsumedHistory] = useState([]);

  // Estados de control para la nueva gestión de productos (Traducción de tus modales web)
  const [neveraInventario, setNeveraInventario] = useState({ '1': 500, '2': 1000, '4': 3 }); // cantidades iniciales en stock
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [tarjetaExpandidaId, setTarjetaExpandidaId] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(null);

  // --- ANIMACIONES ---
  const chartScale = useRef(new Animated.Value(0)).current;
  const chartOpacity = useRef(new Animated.Value(0)).current;
  const progresoAnim = useRef(new Animated.Value(0)).current;
  const escalaAnim = useRef(new Animated.Value(1)).current;

  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
  const availableCalories = totalCalories - consumedCalories;

  useEffect(() => {
    if (currentScreen === 'despensa' && ingredients.length > 0) {
      chartScale.setValue(0);
      chartOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(chartScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(chartOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [ingredients.length, currentScreen]);

  const navegarConCortina = (targetScreen) => {
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(escalaAnim, { toValue: 1, duration: 700, useNativeDriver: true })
      ])
    );

    Animated.timing(progresoAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      latido.start();
      setCurrentScreen(targetScreen);
      
      setTimeout(() => {
        latido.stop(); 
        Animated.timing(escalaAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        Animated.timing(progresoAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }, 1200);
    });
  };

  const posicionCortina = progresoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenHeight, 0], 
  });

  // --- CONFIGURACIÓN DE COLORES / TEMAS ---
  const theme = {
    bg: isDarkMode ? '#121212' : '#eff6ff',
    text: isDarkMode ? '#FFFFFF' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    header: isDarkMode ? '#1f1f1f' : '#FFFFFF',
    card: isDarkMode ? '#1e1e1e' : '#FFFFFF',
    border: isDarkMode ? '#374151' : '#f3f4f6',
    itemHistoryBg: isDarkMode ? '#262626' : '#fafafa',
    accent: '#3b82f6',
    legendText: isDarkMode ? '#FFFFFF' : '#333333'
  };

  const getChartData = () => {
    const typeCalories = {};
    ingredients.forEach((ing) => {
      if (!typeCalories[ing.type]) typeCalories[ing.type] = 0;
      typeCalories[ing.type] += ing.calories;
    });

    return Object.entries(typeCalories).map(([type, calories]) => ({
      name: FOOD_TYPES[type]?.label || type,
      population: calories,
      color: FOOD_TYPES[type]?.color || '#6b7280',
      legendFontColor: theme.legendText,
      legendFontSize: 12,
    }));
  };

  const handleConsumeIngredient = (ingredient) => {
    setConsumedCalories((prev) => prev + ingredient.calories);
    setConsumedHistory((prev) => [
      {
        ...ingredient,
        consumedAt: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev,
    ]);
    setIngredients((prev) => prev.filter((ing) => ing.id !== ingredient.id));
  };

  // --- LÓGICA DE GESTIÓN DE NEVERA (AÑADIR / ENVIAR) ---
  const addProductToNevera = (id) => {
    const prod = PRODUCTOS_BASE[id];
    let incremento = 1;
    if (prod.tipo === 'gramos') incremento = 250;

    setNeveraInventario((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + incremento,
    }));
  };

  const handleEnviarACalorias = (id, cantidad) => {
    const prod = PRODUCTOS_BASE[id];
    
    // Añadimos el ingrediente extraído al gestor de calorías
    const nuevoIngrediente = {
      id: `${id}-${Date.now()}`,
      name: prod.nombre,
      calories: Math.round((prod.calorias * cantidad) / (prod.tipo === 'gramos' ? 100 : 1)),
      type: prod.tipoFood,
    };

    setIngredients((prev) => [...prev, nuevoIngrediente]);

    // Descontamos del stock de la nevera
    setNeveraInventario((prev) => {
      const restanta = (prev[id] || 0) - cantidad;
      const copia = { ...prev };
      if (restanta <= 0) delete copia[id];
      else copia[id] = restanta;
      return copia;
    });

    setTarjetaExpandidaId(null);
  };

  const productosFiltradosBusqueda = Object.values(PRODUCTOS_BASE).filter((p) => {
    const q = filtroBusqueda.toLowerCase();
    return p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- CORTINA GLOBAL --- */}
      <Animated.View style={[styles.cortina, { backgroundColor: theme.accent, top: posicionCortina, height: screenHeight }]}>
        <Animated.View style={{ transform: [{ scale: escalaAnim }] }}>
          <Text style={styles.textCortina}>NEVERITA</Text>
        </Animated.View>
      </Animated.View>

      {/* --- HEADER --- */}
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
          {currentScreen === 'home' ? 'Mi App' : currentScreen === 'despensa' ? 'Mi Despensa' : 'Mi Nevera'}
        </Text>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO DINÁMICO --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === VISTA 1: HOME === */}
        {currentScreen === 'home' && (
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
        )}

        {/* === VISTA 2: CALORÍAS (DESPENSA) === */}
        {currentScreen === 'despensa' && (
          <View style={[styles.content, { width: screenWidth }]}>
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Calorías Totales</Text>
                <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>{totalCalories}</Text>
                <Text style={styles.summaryUnit}>kcal</Text>
              </View>

              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Disponibles</Text>
                <Text style={[styles.summaryValue, { color: '#10b981' }]}>{availableCalories}</Text>
                <Text style={styles.summaryUnit}>kcal</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, styles.consumedCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Calorías Consumidas</Text>
              <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{consumedCalories}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${totalCalories + consumedCalories > 0 ? (consumedCalories / (totalCalories + consumedCalories)) * 100 : 0}%` }]} />
              </View>
            </View>

            {ingredients.length > 0 && (
              <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>Distribución por Tipo</Text>
                <Animated.View style={{ opacity: chartOpacity, transform: [{ scale: chartScale }] }}>
                  <PieChart
                    data={getChartData()}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </Animated.View>
              </View>
            )}

            {/* Listado de Ingredientes */}
            <View style={[styles.ingredientsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.ingredientsHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.ingredientsTitle, { color: theme.text }]}>Ingredientes ({ingredients.length})</Text>
              </View>
              {ingredients.length === 0 ? (
                <View style={styles.emptyState}><Text style={styles.emptyIcon}>🧊</Text><Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay ingredientes activos</Text></View>
              ) : (
                ingredients.map((ingredient, index) => (
                  <View key={ingredient.id} style={[styles.ingredientItem, { borderBottomColor: theme.border }, index === ingredients.length - 1 && styles.ingredientItemLast]}>
                    <View style={styles.ingredientContent}>
                      <View style={[styles.ingredientDot, { backgroundColor: FOOD_TYPES[ingredient.type]?.color || '#6b7280' }]} />
                      <View style={styles.ingredientInfo}>
                        <Text style={[styles.ingredientName, { color: theme.text }]}>{ingredient.name}</Text>
                        <Text style={[styles.ingredientType, { color: theme.textSecondary }]}>{FOOD_TYPES[ingredient.type]?.label || ingredient.type}</Text>
                      </View>
                      <View style={styles.ingredientCalories}>
                        <Text style={styles.caloriesValue}>{ingredient.calories}</Text>
                        <Text style={[styles.caloriesUnit, { color: theme.textSecondary }]}>kcal</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.consumeButton} onPress={() => handleConsumeIngredient(ingredient)}>
                      <Text style={styles.consumeButtonText}>🛒</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Historial */}
            <View style={[styles.ingredientsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.ingredientsHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.ingredientsTitle, { color: theme.text }]}>Historial Consumo ({consumedHistory.length})</Text>
              </View>
              {consumedHistory.map((item, index) => (
                <View key={`${item.id}-${index}`} style={[styles.historyItem, { backgroundColor: theme.itemHistoryBg, borderBottomColor: theme.border }]}>
                  <View style={styles.ingredientContent}>
                    <View style={[styles.ingredientDot, { backgroundColor: FOOD_TYPES[item.type]?.color || '#6b7280' }]} />
                    <View style={styles.ingredientInfo}>
                      <Text style={[styles.ingredientName, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[styles.ingredientType, { color: theme.textSecondary }]}>Consumido a las {item.consumedAt}</Text>
                    </View>
                    <View style={styles.ingredientCalories}>
                      <Text style={styles.caloriesValue}>{item.calories}</Text>
                      <Text style={[styles.caloriesUnit, { color: theme.textSecondary }]}>kcal</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* === VISTA 3: GESTIÓN DE NEVERA (INVENTARIO FÍSICO) === */}
        {currentScreen === 'nevera_inventario' && (
          <View style={[styles.content, { width: screenWidth }]}>
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

                    {/* Panel desplegable nativo para enviar al módulo de calorías */}
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
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ================= MODAL NATIVO AÑADIR PRODUCTO ================= */}
      <Modal visible={modalAddVisible} animationType="slide" transparent={true} onRequestClose={() => setModalAddVisible(false)}>
        <View style={styles.overlayModal}>
          <View style={[styles.contenidoModal, { backgroundColor: theme.card }]}>
            <View style={[styles.headerModal, { borderBottomColor: theme.border }]}>
              <Text style={[styles.tituloModal, { color: theme.text }]}>Añadir producto</Text>
              <TouchableOpacity onPress={() => setModalAddVisible(false)}><Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>✕</Text></TouchableOpacity>
            </View>
            
            <TextInput 
              style={[styles.inputBusqueda, { borderColor: theme.border, color: theme.text }]}
              placeholder="Buscar por nombre o categoría..."
              placeholderTextColor={theme.textSecondary}
              value={filtroBusqueda}
              onChangeText={setFiltroBusqueda}
            />

            <ScrollView style={{ maxHeight: 300 }}>
              {productosFiltradosBusqueda.length === 0 && <Text style={[styles.noResultados, { color: theme.textSecondary }]}>Sin resultados</Text>}
              {productosFiltradosBusqueda.map((p) => (
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

      {/* ================= MODAL NATIVO DETALLES PRODUCTO ================= */}
      <Modal visible={productoActivo !== null} animationType="fade" transparent={true} onRequestClose={() => setProductoActivo(null)}>
        <View style={styles.overlayModal}>
          <View style={[styles.contenidoModal, { backgroundColor: theme.card, paddingBottom: 24 }]}>
            <View style={[styles.headerModal, { borderBottomColor: theme.border }]}>
              <Text style={[styles.tituloModal, { color: theme.text }]}>{productoActivo?.nombre}</Text>
              <TouchableOpacity onPress={() => setProductoActivo(null)}><Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>✕</Text></TouchableOpacity>
            </View>

            <View style={styles.modalFilaInfo}>
              <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Categoría</Text>
              <Text style={styles.modalBadge}>{productoActivo?.categoria}</Text>
            </View>
            <View style={styles.modalFilaInfo}>
              <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Unidad de medida</Text>
              <Text style={{ color: theme.text }}>{productoActivo?.tipo}</Text>
            </View>
            <View style={styles.modalFilaInfo}>
              <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Calorías Base</Text>
              <Text style={{ color: theme.text, fontWeight: 'bold' }}>{productoActivo?.calorias} kcal</Text>
            </View>
            <View style={styles.modalFilaInfo}>
              <Text style={[styles.modalLabelInfo, { color: theme.textSecondary }]}>Proteínas</Text>
              <Text style={{ color: theme.text }}>{productoActivo?.proteinas}</Text>
            </View>

            <Text style={[styles.descripcionProductoModal, { color: theme.text, backgroundColor: theme.itemHistoryBg }]}>
              {productoActivo?.descripcion}
            </Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  scrollContent: { paddingVertical: 16 },
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
  
  // --- ESTILOS COMPARTIDOS ---
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  consumedCard: { marginTop: 4 },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: 'bold' },
  summaryUnit: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#ef4444', borderRadius: 4 },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  ingredientsCard: {
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  ingredientsHeader: { padding: 16, borderBottomWidth: 1 },
  ingredientsTitle: { fontSize: 16, fontWeight: 'bold' },
  emptyState: { padding: 32, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 8, opacity: 0.5 },
  emptyText: { fontSize: 14 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  historyItem: { padding: 16, borderBottomWidth: 1 },
  ingredientItemLast: { borderBottomWidth: 0 },
  ingredientContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  ingredientDot: { width: 12, height: 12, borderRadius: 6 },
  ingredientInfo: { flex: 1 },
  ingredientName: { fontSize: 14, fontWeight: '500' },
  ingredientType: { fontSize: 12 },
  ingredientCalories: { alignItems: 'flex-end' },
  caloriesValue: { fontSize: 16, fontWeight: 'bold', color: '#3b82f6' },
  caloriesUnit: { fontSize: 12 },
  consumeButton: { backgroundColor: '#ef4444', width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  consumeButtonText: { fontSize: 16 },

  // --- NUEVOS ESTILOS INTEGRADOS DE LA NEVERA VISTA ---
  btnAgregarNevera: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 8 },
  btnAgregarNeveraText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyStateNative: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  cardNeveraWrap: { borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden', elevation: 1 },
  cardNeveraPrincipal: { flexDirection: 'row', alignItems: 'center', padding: 16 },
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

  // --- ESTILOS DE LOS MODALES ---
  overlayModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  contenidoModal: { width: '100%', borderRadius: 16, padding: 16, elevation: 5 },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, marginBottom: 12 },
  tituloModal: { fontSize: 18, fontWeight: 'bold' },
  inputBusqueda: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14 },
  noResultados: { textAlign: 'center', padding: 16 },
  itemFilaProducto: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  nombreItemModal: { fontSize: 15, fontWeight: '500' },
  tagYaEnNevera: { fontSize: 11, backgroundColor: '#e0f2fe', color: '#0369a1', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', marginRight: 8 },
  plusFilaModal: { fontSize: 20, color: '#3b82f6', fontWeight: 'bold', paddingHorizontal: 4 },
  modalFilaInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  modalLabelInfo: { fontSize: 14 },
  modalBadge: { backgroundColor: '#3b82f6', color: 'white', fontSize: 12, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden' },
  descripcionProductoModal: { marginTop: 16, padding: 12, borderRadius: 8, fontSize: 13, fontStyle: 'italic', lineHeight: 18 }
});