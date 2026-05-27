import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Easing, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  useWindowDimensions, 
  View 
} from 'react-native';
import { Audio } from 'expo-av';

// Importaciones de configuración y estilos
import { PRODUCTOS_BASE, FOOD_TYPES } from './src/constants/data';
import { getTheme } from './src/styles/theme';

// Importaciones de Componentes Comunes
import CortinaGlobal from './src/components/CortinaGlobal';
import Header from './src/components/Header';
import AddProductModal from './src/components/AddProductModal';
import ProductDetailsModal from './src/components/ProductDetailsModal';

// Importaciones de Pantallas (Screens)
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DespensaScreen from './src/screens/DespensaScreen';
import NeveraScreen from './src/screens/NeveraScreen';

export default function App() {
  // --- ESTADOS DE CONTROL GENERAL ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // --- REFS Y ESTADOS DE AUDIO ---
  const sonidoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false); // Estado para saber si el usuario silencia el audio

  // --- ESTADOS DE DATOS (DESPENSA / NEVERA) ---
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

  // --- SUBESTADOS DE MODALES Y FILTROS ---
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [tarjetaExpandidaId, setTarjetaExpandidaId] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(null);

  // --- CONFIGURACIÓN DE ANIMACIONES ---
  const chartScale = useRef(new Animated.Value(0)).current;
  const chartOpacity = useRef(new Animated.Value(0)).current;
  const progresoAnim = useRef(new Animated.Value(0)).current;
  const escalaAnim = useRef(new Animated.Value(1)).current;

  // --- CÁLCULOS DERIVADOS Y TEMAS ---
  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
  const availableCalories = totalCalories - consumedCalories;
  const theme = getTheme(isDarkMode);

  // --- LÓGICA DE AUDIO (PRECARGA Y REPRODUCCIÓN) ---
  const precargarSonido = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Descargamos cualquier instancia previa por seguridad
      if (sonidoRef.current) {
        await sonidoRef.current.unloadAsync();
      }

      // Cargamos el archivo .m4a en memoria de forma estática
      const { sound } = await Audio.Sound.createAsync(
        require('./src/assets/audio/musica_fondo.m4a'), // Cambiado a .m4a
        { 
          shouldPlay: false, // No se reproduce solo al cargar
          isLooping: true,   // Mantiene el bucle si es música de fondo
          volume: 0.35 
        }
      );
      sonidoRef.current = sound;
    } catch (error) {
      console.log("Error al precargar el archivo .m4a:", error);
    }
  };

  // Función que se ejecutará al pulsar el botón del Header
  const toggleSonido = async () => {
    if (!sonidoRef.current) return;

    try {
      const status = await sonidoRef.current.getStatusAsync();
      
      if (status.isPlaying) {
        await sonidoRef.current.pauseAsync();
        setIsMuted(true);
      } else {
        await sonidoRef.current.playAsync();
        setIsMuted(false);
      }
    } catch (error) {
      console.log("Error al controlar el botón de sonido:", error);
    }
  };

  const liberarSonido = async () => {
    if (sonidoRef.current) {
      await sonidoRef.current.stopAsync();
      await sonidoRef.current.unloadAsync();
      sonidoRef.current = null;
    }
  };

  // Precargamos cuando el usuario inicia sesión y limpiamos al salir
  useEffect(() => {
    if (isAuthenticated) {
      precargarSonido();
    } else {
      liberarSonido();
      setIsMuted(false);
    }

    return () => {
      liberarSonido();
    };
  }, [isAuthenticated]);

  // Animación del gráfico circular
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

  // Transición de cortina animada
  const navegarConCortina = (targetScreen) => {
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnim, { toValue: 1.05, duration: 700, useNativeDriver: true }),
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center' }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <LoginScreen onLogin={() => setIsAuthenticated(true)} theme={theme} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <CortinaGlobal posicionCortina={posicionCortina} screenHeight={screenHeight} escalaAnim={escalaAnim} theme={theme} />

      {/* Pasamos las nuevas propiedades del botón de audio al Header */}
      <Header 
        currentScreen={currentScreen} 
        navegarConCortina={navegarConCortina} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        theme={theme} 
        isMuted={isMuted}
        onToggleSonido={toggleSonido}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentScreen('home'); 
        }}
      />

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