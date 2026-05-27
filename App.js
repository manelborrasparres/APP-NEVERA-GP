import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, ScrollView, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';

// Importaciones de configuración y estilos
import { PRODUCTOS_BASE, FOOD_TYPES } from './src/constants/data';
import { getTheme } from './src/styles/theme';

// Importaciones de Componentes
import CortinaGlobal from './src/components/CortinaGlobal';
import Header from './src/components/Header';
import AddProductModal from './src/components/AddProductModal';
import ProductDetailsModal from './src/components/ProductDetailsModal';

// Importaciones de Pantallas
import HomeScreen from './src/screens/HomeScreen';
import DespensaScreen from './src/screens/DespensaScreen';
import NeveraScreen from './src/screens/NeveraScreen';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // --- ESTADOS DE LA APLICACIÓN ---
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
  const [neveraInventario, setNeveraInventario] = useState({ '1': 500, '2': 1000, '4': 3 }); 

  // Controladores de Modales y Subestados
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
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    if (currentScreen === 'despensa' && ingredients.length > 0) {
      chartScale.setValue(0);
      chartOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(chartScale, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
        Animated.timing(chartOpacity, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
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

    Animated.timing(progresoAnim, { toValue: 1, duration: 500, useNativeDriver: false }).start(() => {
      latido.start();
      setCurrentScreen(targetScreen);
      setTimeout(() => {
        latido.stop(); 
        Animated.timing(escalaAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        Animated.timing(progresoAnim, { toValue: 0, duration: 500, useNativeDriver: false }).start();
      }, 1200);
    });
  };

  const posicionCortina = progresoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenHeight, 0], 
  });

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
    setConsumedHistory((prev) => [{ ...ingredient, consumedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }, ...prev]);
    setIngredients((prev) => prev.filter((ing) => ing.id !== ingredient.id));
  };

  const addProductToNevera = (id) => {
    const prod = PRODUCTOS_BASE[id];
    let incremento = prod?.tipo === 'gramos' ? 250 : 1;
    setNeveraInventario((prev) => ({ ...prev, [id]: (prev[id] || 0) + incremento }));
  };

  const handleEnviarACalorias = (id, cantidad) => {
    const prod = PRODUCTOS_BASE[id];
    const nuevoIngrediente = {
      id: `${id}-${Date.now()}`,
      name: prod.nombre,
      calories: Math.round((prod.calorias * cantidad) / (prod.tipo === 'gramos' ? 100 : 1)),
      type: prod.tipoFood,
    };

    setIngredients((prev) => [...prev, nuevoIngrediente]);
    setNeveraInventario((prev) => {
      const restanta = (prev[id] || 0) - cantidad;
      const copia = { ...prev };
      if (restanta <= 0) delete copia[id];
      else copia[id] = restanta;
      return copia;
    });
    setTarjetaExpandidaId(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <CortinaGlobal posicionCortina={posicionCortina} screenHeight={screenHeight} escalaAnim={escalaAnim} theme={theme} />

      <Header currentScreen={currentScreen} navegarConCortina={navegarConCortina} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} theme={theme} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentScreen === 'home' && (
          <HomeScreen navegarConCortina={navegarConCortina} screenWidth={screenWidth} theme={theme} />
        )}

        {currentScreen === 'despensa' && (
          <DespensaScreen 
            ingredients={ingredients} totalCalories={totalCalories} availableCalories={availableCalories} consumedCalories={consumedCalories}
            chartOpacity={chartOpacity} chartScale={chartScale} getChartData={getChartData} handleConsumeIngredient={handleConsumeIngredient}
            screenWidth={screenWidth} theme={theme}
          />
        )}

        {currentScreen === 'nevera_inventario' && (
          <NeveraScreen 
            neveraInventario={neveraInventario} tarjetaExpandidaId={tarjetaExpandidaId} setTarjetaExpandidaId={setTarjetaExpandidaId}
            cantidadSeleccionada={cantidadSeleccionada} setCantidadSeleccionada={setCantidadSeleccionada} setModalAddVisible={setModalAddVisible}
            setProductoActivo={setProductoActivo} handleEnviarACalorias={handleEnviarACalorias} theme={theme}
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      <AddProductModal 
        visible={modalAddVisible} onClose={() => setModalAddVisible(false)} filtroBusqueda={filtroBusqueda} setFiltroBusqueda={setFiltroBusqueda}
        neveraInventario={neveraInventario} addProductToNevera={addProductToNevera} theme={theme}
      />

      <ProductDetailsModal producto={productoActivo} onClose={() => setProductoActivo(null)} theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingVertical: 16, paddingHorizontal: 16 }
});