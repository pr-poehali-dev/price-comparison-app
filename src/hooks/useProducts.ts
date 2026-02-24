import { useState, useCallback } from 'react';
import { Product, HistoryEntry, calcPricePerUnit, Unit } from '@/types/product';

const DEMO_FAVORITES: Product[] = [
  {
    id: 'fav1',
    name: 'Молоко 3.2%',
    brand: 'Простоквашино',
    price: 89,
    amount: 1,
    unit: 'л',
    category: 'dairy',
    pricePerKg: 89,
    isFavorite: true,
    addedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'fav2',
    name: 'Сахар белый',
    brand: 'Свекла',
    price: 50,
    amount: 1,
    unit: 'кг',
    category: 'sugar',
    pricePerKg: 50,
    isFavorite: true,
    addedAt: new Date(Date.now() - 86400000),
  },
];

const DEMO_HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    date: new Date(Date.now() - 86400000),
    category: 'sugar',
    winnerId: 'h1p1',
    products: [
      { id: 'h1p1', name: 'Сахар', brand: 'Свекла', price: 50, amount: 1, unit: 'кг', category: 'sugar', pricePerKg: 50, addedAt: new Date() },
      { id: 'h1p2', name: 'Сахар', brand: 'Свекла Сладкая', price: 50, amount: 0.9, unit: 'кг', category: 'sugar', pricePerKg: 55.6, addedAt: new Date() },
    ],
  },
  {
    id: 'h2',
    date: new Date(Date.now() - 86400000 * 3),
    category: 'dairy',
    winnerId: 'h2p2',
    products: [
      { id: 'h2p1', name: 'Молоко 2.5%', brand: 'Домик в деревне', price: 95, amount: 1, unit: 'л', category: 'dairy', pricePerKg: 95, addedAt: new Date() },
      { id: 'h2p2', name: 'Молоко 2.5%', brand: 'Вкуснотеево', price: 79, amount: 0.9, unit: 'л', category: 'dairy', pricePerKg: 87.8, addedAt: new Date() },
    ],
  },
];

export function useProducts() {
  const [favorites, setFavorites] = useState<Product[]>(DEMO_FAVORITES);
  const [history, setHistory] = useState<HistoryEntry[]>(DEMO_HISTORY);
  const [totalSaved, setTotalSaved] = useState(47.5);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, { ...product, isFavorite: true }];
    });
  }, []);

  const removeFromFavorites = useCallback((id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  }, []);

  const saveComparison = useCallback((products: Product[], winnerId: string, category: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date(),
      products,
      winnerId,
      category,
    };
    setHistory(prev => [entry, ...prev]);

    const winner = products.find(p => p.id === winnerId);
    const others = products.filter(p => p.id !== winnerId);
    if (winner && others.length > 0) {
      const avgOther = others.reduce((s, p) => s + (p.pricePerKg || 0), 0) / others.length;
      const saved = Math.max(0, avgOther - (winner.pricePerKg || 0));
      setTotalSaved(prev => +(prev + saved).toFixed(2));
    }
  }, []);

  const buildProduct = useCallback((
    name: string, brand: string, price: number, amount: number, unit: Unit, category: string
  ): Product => {
    const pricePerKg = calcPricePerUnit(price, amount, unit);
    return {
      id: Date.now().toString() + Math.random(),
      name, brand, price, amount, unit, category,
      pricePerKg,
      isFavorite: false,
      addedAt: new Date(),
    };
  }, []);

  return { favorites, history, totalSaved, addToFavorites, removeFromFavorites, saveComparison, buildProduct };
}
