export const getTheme = (isDarkMode) => ({
  bg: isDarkMode ? '#121212' : '#eff6ff',
  text: isDarkMode ? '#FFFFFF' : '#1f2937',
  textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
  header: isDarkMode ? '#1f1f1f' : '#FFFFFF',
  card: isDarkMode ? '#1e1e1e' : '#FFFFFF',
  border: isDarkMode ? '#374151' : '#f3f4f6',
  itemHistoryBg: isDarkMode ? '#262626' : '#fafafa',
  accent: '#3b82f6',
  legendText: isDarkMode ? '#FFFFFF' : '#333333'
});