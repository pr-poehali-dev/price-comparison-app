export type Unit = 'кг' | 'г' | 'л' | 'мл' | 'шт' | 'уп';

export interface Product {
  id: string;
  name: string;
  brand: string;
  store: string;
  price: number;
  amount: number;
  unit: Unit;
  category: string;
  pricePerKg?: number;
  isFavorite?: boolean;
  addedAt: Date;
}

export const STORES = [
  { id: '', label: 'Магазин', emoji: '🏪' },
  { id: 'Пятёрочка', label: 'Пятёрочка', emoji: '5️⃣' },
  { id: 'Магнит', label: 'Магнит', emoji: '🧲' },
  { id: 'Дикси', label: 'Дикси', emoji: '🔵' },
  { id: 'Перекрёсток', label: 'Перекрёсток', emoji: '✖️' },
  { id: 'ВкусВилл', label: 'ВкусВилл', emoji: '🌿' },
  { id: 'Лента', label: 'Лента', emoji: '🎀' },
  { id: 'Ашан', label: 'Ашан', emoji: '🛒' },
  { id: 'Другой', label: 'Другой', emoji: '📍' },
];

export interface ComparisonResult {
  products: Product[];
  winnerId: string;
  savings: number;
  savingsPercent: number;
}

export interface HistoryEntry {
  id: string;
  date: Date;
  products: Product[];
  winnerId: string;
  category: string;
}

export const UNITS: Unit[] = ['кг', 'г', 'л', 'мл', 'шт', 'уп'];

export const UNIT_TO_BASE: Record<Unit, number> = {
  'кг': 1,
  'г': 0.001,
  'л': 1,
  'мл': 0.001,
  'шт': 1,
  'уп': 1,
};

export const UNIT_LABEL: Record<Unit, string> = {
  'кг': '₽/кг',
  'г': '₽/кг',
  'л': '₽/л',
  'мл': '₽/л',
  'шт': '₽/шт',
  'уп': '₽/уп',
};

export const CATEGORIES = [
  { id: 'all', label: 'Все', emoji: '🛒' },
  { id: 'sugar', label: 'Сахар', emoji: '🍬' },
  { id: 'dairy', label: 'Молочное', emoji: '🥛' },
  { id: 'meat', label: 'Мясо', emoji: '🥩' },
  { id: 'oil', label: 'Масло', emoji: '🫙' },
  { id: 'cereal', label: 'Крупы', emoji: '🌾' },
  { id: 'bread', label: 'Хлеб', emoji: '🍞' },
  { id: 'drinks', label: 'Напитки', emoji: '🥤' },
  { id: 'other', label: 'Прочее', emoji: '📦' },
];

export function calcPricePerUnit(price: number, amount: number, unit: Unit): number {
  const base = UNIT_TO_BASE[unit];
  const baseAmount = amount * base;
  if (baseAmount === 0) return 0;
  return price / baseAmount;
}