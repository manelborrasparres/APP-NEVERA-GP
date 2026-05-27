export const FOOD_TYPES = {
  proteina: { label: 'Proteína', color: '#ef4444' },
  carbohidrato: { label: 'Carbohidrato', color: '#f59e0b' },
  verdura: { label: 'Verdura', color: '#10b981' },
  fruta: { label: 'Fruta', color: '#8b5cf6' },
  lacteo: { label: 'Lácteo', color: '#3b82f6' },
  grasa: { label: 'Grasa', color: '#ec4899' },
  bebida: { label: 'Bebida', color: '#06b6d4' },
  otro: { label: 'Otro', color: '#6b7280' },
};

export const PRODUCTOS_BASE = {
  '1': { id: '1', nombre: 'Pollo', calorias: 450, proteinas: '31g', categoria: 'Proteína', tipo: 'gramos', tipoFood: 'proteina', descripcion: 'Pechuga de pollo fresca, ideal para plancha.' },
  '2': { id: '2', nombre: 'Arroz', calorias: 350, proteinas: '7g', categoria: 'Carbohidrato', tipo: 'gramos', tipoFood: 'carbohidrato', descripcion: 'Arroz blanco de grano largo.' },
  '3': { id: '3', nombre: 'Brócoli', calorias: 55, proteinas: '2.8g', categoria: 'Verdura', tipo: 'gramos', tipoFood: 'verdura', descripcion: 'Rico en vitaminas y fibra.' },
  '4': { id: '4', nombre: 'Manzana', calorias: 95, proteinas: '0.3g', categoria: 'Fruta', tipo: 'unidades', tipoFood: 'fruta', descripcion: 'Manzana macedonia crujiente.' },
  '5': { id: '5', nombre: 'Leche', calorias: 150, proteinas: '8g', categoria: 'Lácteo', tipo: 'litros', tipoFood: 'lacteo', descripcion: 'Leche entera pasteurizada.' },
  '6': { id: '6', nombre: 'Aguacate', calorias: 240, proteinas: '2g', categoria: 'Grasa', tipo: 'unidades', tipoFood: 'grasa', descripcion: 'Grasas saludables y textura cremosa.' },
};

export const OPCIONES_CANTIDAD = {
  litros: [0.25, 0.5, 1, 2],
  gramos: [100, 250, 500, 1000],
  unidades: [1, 2, 6, 12],
};