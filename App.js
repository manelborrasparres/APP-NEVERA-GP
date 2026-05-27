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
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Feather, Ionicons } from '@expo/vector-icons';

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

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' o 'despensa'
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // --- ESTADOS DE LA DESPENSA ---
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

  // --- ANIMACIONES ---
  const chartScale = useRef(new Animated.Value(0)).current;
  const chartOpacity = useRef(new Animated.Value(0)).current;
  const progresoAnim = useRef(new Animated.Value(0)).current;
  const escalaAnim = useRef(new Animated.Value(1)).current;

  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
  const availableCalories = totalCalories - consumedCalories;

  // Animación del Gráfico cuando se entra a la despensa o cambia su tamaño
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

  // Transición de la cortina para cambiar de pantalla
  const navegarConCortina = (targetScreen) => {
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(escalaAnim, { toValue: 1, duration: 700, useNativeDriver: true })
      ])
    );

    // PASO A: Bajar la cortina
    Animated.timing(progresoAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      
      // PASO B: Iniciar latido y cambiar pantalla en secreto detrás de la cortina
      latido.start();
      setCurrentScreen(targetScreen);
      
      // PASO C: Simular carga de 1.2 segundos
      setTimeout(() => {
        latido.stop(); 
        Animated.timing(escalaAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        // PASO D: Subir la cortina
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

  // --- CONFIGURACIÓN DE COLORES ---
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
      name: FOOD_TYPES[type].label,
      population: calories,
      color: FOOD_TYPES[type].color,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- CORTINA GLOBAL --- */}
      <Animated.View 
        style={[
          styles.cortina, 
          { 
            backgroundColor: theme.accent,
            top: posicionCortina,
            height: screenHeight,
          }
        ]}
      >
        <Animated.View style={{ transform: [{ scale: escalaAnim }] }}>
          <Text style={styles.textCortina}>NEVERITA</Text>
        </Animated.View>
      </Animated.View>

      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        {currentScreen === 'despensa' ? (
          <TouchableOpacity onPress={() => navegarConCortina('home')}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Feather name="user" size={24} color={theme.text} />
          </TouchableOpacity>
        )}

        <Text style={[styles.title, { color: theme.text }]}>
          {currentScreen === 'home' ? 'Mi App' : 'Mi Despensa'}
        </Text>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO DINÁMICO --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- VISTA 1: HOME --- */}
        {currentScreen === 'home' && (
          <View style={styles.centerContainer}>
            {/* Tarjeta 1: Abre la despensa */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navegarConCortina('despensa')}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
            >
              <Text style={styles.cardEmoji}>🧊</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Despensa</Text>
              <Text style={{ color: theme.textSecondary }}>Toca para ver tus calorías e ingredientes</Text>
            </TouchableOpacity>

            {/* Tarjeta 2 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
            >
              <Text style={styles.cardEmoji}>🏋️‍♂️</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Entrenamientos</Text>
              <Text style={{ color: theme.textSecondary }}>Próximamente...</Text>
            </TouchableOpacity>

            {/* Tarjeta 3 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, width: screenWidth * 0.92 }]}
            >
              <Text style={styles.cardEmoji}>💧</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Registro de Agua</Text>
              <Text style={{ color: theme.textSecondary }}>Próximamente...</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- VISTA 2: DESPENSA (GESTOR DE CALORÍAS) --- */}
        {currentScreen === 'despensa' && (
          <View style={[styles.content, { width: screenWidth }]}>
            
            {/* Grid de calorías */}
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

            {/* Tarjeta consumidas */}
            <View style={[styles.summaryCard, styles.consumedCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Calorías Consumidas</Text>
              <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{consumedCalories}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        totalCalories + consumedCalories > 0
                          ? (consumedCalories / (totalCalories + consumedCalories)) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Gráfico */}
            {ingredients.length > 0 && (
              <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.chartTitle, { color: theme.text }]}>Distribución por Tipo</Text>
                <Animated.View style={{ opacity: chartOpacity, transform: [{ scale: chartScale }] }}>
                  <PieChart
                    data={getChartData()}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </Animated.View>
              </View>
            )}

            {/* Lista de Ingredientes */}
            <View style={[styles.ingredientsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.ingredientsHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.ingredientsTitle, { color: theme.text }]}>
                  Ingredientes ({ingredients.length})
                </Text>
              </View>

              {ingredients.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🧊</Text>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay ingredientes en la nevera</Text>
                </View>
              ) : (
                ingredients.map((ingredient, index) => (
                  <View
                    key={ingredient.id}
                    style={[
                      styles.ingredientItem,
                      { borderBottomColor: theme.border },
                      index === ingredients.length - 1 && styles.ingredientItemLast,
                    ]}>
                    <View style={styles.ingredientContent}>
                      <View style={[styles.ingredientDot, { backgroundColor: FOOD_TYPES[ingredient.type].color }]} />
                      <View style={styles.ingredientInfo}>
                        <Text style={[styles.ingredientName, { color: theme.text }]}>{ingredient.name}</Text>
                        <Text style={[styles.ingredientType, { color: theme.textSecondary }]}>
                          {FOOD_TYPES[ingredient.type].label}
                        </Text>
                      </View>
                      <View style={styles.ingredientCalories}>
                        <Text style={styles.caloriesValue}>{ingredient.calories}</Text>
                        <Text style={[styles.caloriesUnit, { color: theme.textSecondary }]}>kcal</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.consumeButton}
                      onPress={() => handleConsumeIngredient(ingredient)}>
                      <Text style={styles.consumeButtonText}>🛒</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Historial */}
            <View style={[styles.ingredientsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.ingredientsHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.ingredientsTitle, { color: theme.text }]}>
                  Historial de Consumidos ({consumedHistory.length})
                </Text>
              </View>

              {consumedHistory.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📋</Text>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Todavía no has consumido productos</Text>
                </View>
              ) : (
                consumedHistory.map((item, index) => (
                  <View
                    key={`${item.id}-${index}`}
                    style={[
                      styles.historyItem,
                      { backgroundColor: theme.itemHistoryBg, borderBottomColor: theme.border },
                      index === consumedHistory.length - 1 && styles.ingredientItemLast,
                    ]}>
                    <View style={styles.ingredientContent}>
                      <View style={[styles.ingredientDot, { backgroundColor: FOOD_TYPES[item.type].color }]} />
                      <View style={styles.ingredientInfo}>
                        <Text style={[styles.ingredientName, { color: theme.text }]}>{item.name}</Text>
                        <Text style={[styles.ingredientType, { color: theme.textSecondary }]}>
                          Consumido a las {item.consumedAt}
                        </Text>
                      </View>
                      <View style={styles.ingredientCalories}>
                        <Text style={styles.caloriesValue}>{item.calories}</Text>
                        <Text style={[styles.caloriesUnit, { color: theme.textSecondary }]}>kcal</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  
  // --- ESTILOS DESPENSA ---
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
  consumedCard: {
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryUnit: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
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
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
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
  ingredientsHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  ingredientItemLast: {
    borderBottomWidth: 0,
  },
  ingredientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ingredientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
  },
  ingredientType: {
    fontSize: 12,
  },
  ingredientCalories: {
    alignItems: 'flex-end',
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  caloriesUnit: {
    fontSize: 12,
  },
  consumeButton: {
    backgroundColor: '#ef4444',
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  consumeButtonText: {
    fontSize: 16,
  },
});