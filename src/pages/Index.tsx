import { useState } from 'react';
import Icon from '@/components/ui/icon';
import CompareTab from '@/components/CompareTab';
import HistoryTab from '@/components/HistoryTab';
import FavoritesTab from '@/components/FavoritesTab';
import ProfileTab from '@/components/ProfileTab';
import { useProducts } from '@/hooks/useProducts';
import { Product, Unit } from '@/types/product';

type Tab = 'compare' | 'history' | 'favorites' | 'profile';

interface NavItem {
  id: Tab;
  label: string;
  icon: string;
}

const NAV: NavItem[] = [
  { id: 'compare', label: 'Сравнить', icon: 'Scale' },
  { id: 'history', label: 'История', icon: 'ClipboardList' },
  { id: 'favorites', label: 'Избранное', icon: 'Star' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('compare');
  const { favorites, history, totalSaved, addToFavorites, removeFromFavorites, saveComparison, buildProduct } = useProducts();

  const handleBuildProduct = (name: string, brand: string, price: number, amount: number, unit: Unit, category: string): Product => {
    return buildProduct(name, brand, price, amount, unit, category);
  };

  return (
    <div className="mobile-container bg-background flex flex-col relative">
      {/* Status bar imitation */}
      <div className="h-11 shrink-0" />

      {/* App Header */}
      <header className="px-4 pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center glow-green">
              <span className="text-lg">⚖️</span>
            </div>
            <div>
              <h1 className="font-rubik font-black text-white text-lg leading-none">ЦенаПро</h1>
              <p className="text-muted-foreground text-xs">сравни и сэкономь</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center relative">
              <Icon name="Bell" size={18} className="text-muted-foreground" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Icon name="ScanLine" size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Savings banner */}
      {activeTab === 'compare' && (
        <div
          className="mx-4 mb-4 rounded-2xl p-3 animate-scale-in overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, hsl(270 80% 25%), hsl(142 76% 15%))' }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 80% 50%, hsl(142 76% 50% / 0.3) 0%, transparent 60%), radial-gradient(circle at 20% 50%, hsl(270 80% 65% / 0.3) 0%, transparent 60%)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs mb-0.5">Сэкономлено всего</p>
              <p className="font-rubik font-black text-2xl neon-green">{totalSaved.toFixed(2)}₽</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs mb-0.5">Сравнений</p>
              <p className="text-white font-rubik font-bold text-2xl">{history.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">💰</div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4" key={activeTab}>
        {activeTab === 'compare' && (
          <CompareTab
            onSave={saveComparison}
            onFavorite={addToFavorites}
            buildProduct={handleBuildProduct}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab history={history} />
        )}
        {activeTab === 'favorites' && (
          <FavoritesTab favorites={favorites} onRemove={removeFromFavorites} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            totalSaved={totalSaved}
            historyCount={history.length}
            favoritesCount={favorites.length}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 px-4 pb-6 pt-2 border-t border-border bg-background">
        <div className="flex items-center justify-around">
          {NAV.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10" />
                )}
                <div className="relative">
                  <Icon
                    name={item.icon}
                    size={22}
                    className={`transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  {item.id === 'favorites' && favorites.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-black text-[9px] font-bold">{favorites.length}</span>
                    </div>
                  )}
                  {item.id === 'profile' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <span className={`text-[10px] font-medium relative ${isActive ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
