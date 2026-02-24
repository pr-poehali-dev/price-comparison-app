import { Product, UNIT_LABEL } from '@/types/product';
import Icon from '@/components/ui/icon';

interface FavoritesTabProps {
  favorites: Product[];
  onRemove: (id: string) => void;
}

export default function FavoritesTab({ favorites, onRemove }: FavoritesTabProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">⭐</div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Избранное пусто</p>
          <p className="text-muted-foreground text-sm">Добавляй лучшие варианты при сравнении</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="card-glass rounded-2xl p-4 animate-fade-in">
        <h2 className="font-rubik font-bold text-lg text-white mb-1">Избранные товары</h2>
        <p className="text-muted-foreground text-sm">{favorites.length} самых выгодных вариантов</p>
      </div>

      {favorites.map((product, idx) => {
        const ppu = product.pricePerKg || 0;
        const label = UNIT_LABEL[product.unit];
        return (
          <div
            key={product.id}
            className="card-glass rounded-2xl p-4 animate-slide-up hover-scale"
            style={{ animationDelay: `${idx * 0.07}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <p className="text-white font-semibold">{product.name}</p>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{product.brand}</p>

                <div className="flex items-center gap-4">
                  <div className="bg-secondary/60 rounded-xl px-3 py-2">
                    <p className="text-xs text-muted-foreground mb-0.5">Цена</p>
                    <p className="text-white font-rubik font-bold">{product.price}₽</p>
                    <p className="text-muted-foreground text-xs">/ {product.amount}{product.unit}</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-xl px-3 py-2">
                    <p className="text-xs text-muted-foreground mb-0.5">За единицу</p>
                    <p className="neon-green font-rubik font-bold">{ppu.toFixed(2)}₽</p>
                    <p className="text-muted-foreground text-xs">{label}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemove(product.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-2"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
