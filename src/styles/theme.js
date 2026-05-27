export const getTheme = (isDarkMode) => ({
  bg: isDarkMode ? '#121212' : '#f4f9f5',
  text: isDarkMode ? '#FFFFFF' : '#005e3a',
  textSecondary: isDarkMode ? '#9ca3af' : '#4b7865',
  header: isDarkMode ? '#1f1f1f' : '#005e3a',
  card: isDarkMode ? '#1e1e1e' : '#FFFFFF',
  border: isDarkMode ? '#374151' : '#e1ebe6',
  itemHistoryBg: isDarkMode ? '#262626' : '#fffaf5',
  accent: '#005e3a',         // Verde oscuro principal Mercadona
  accentLight: '#22c55e',    // Verde brillante secundario
  orange: '#ff6600',         // Naranja corporativo Mercadona
  legendText: isDarkMode ? '#FFFFFF' : '#333333'
});