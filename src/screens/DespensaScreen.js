import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { FOOD_TYPES } from '../constants/data';

export default function DespensaScreen({ 
  ingredients, totalCalories, availableCalories, consumedCalories, 
  chartOpacity, chartScale, getChartData, handleConsumeIngredient, screenWidth, theme 
}) {
  return (
    <View style={styles.content}>
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

      {/* Listado */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 16, elevation: 1 },
  consumedCard: { marginTop: 4 },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: 'bold' },
  summaryUnit: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  progressBar: { width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#ef4444', borderRadius: 4 },
  chartCard: { borderRadius: 12, padding: 16, marginTop: 4, elevation: 1 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  ingredientsCard: { borderRadius: 12, marginTop: 4, borderWidth: 1, elevation: 1, overflow: 'hidden' },
  ingredientsHeader: { padding: 16, borderBottomWidth: 1 },
  ingredientsTitle: { fontSize: 16, fontWeight: 'bold' },
  emptyState: { padding: 32, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 8, opacity: 0.5 },
  emptyText: { fontSize: 14 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
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
  consumeButtonText: { fontSize: 16 }
});