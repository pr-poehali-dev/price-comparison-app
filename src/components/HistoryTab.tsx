import { HistoryEntry, CATEGORIES, UNIT_LABEL } from '@/types/product';
import Icon from '@/components/ui/icon';

interface HistoryTabProps {
  history: HistoryEntry[];
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Сегодня';
  if (days === 1) return 'Вчера';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export default function HistoryTab({ history }: HistoryTabProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">📋</div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">История пуста</p>
          <p className="text-muted-foreground text-sm">Сохранённые сравнения появятся здесь</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="card-glass rounded-2xl p-4 animate-fade-in">
        <h2 className="font-rubik font-bold text-lg text-white mb-1">История сравнений</h2>
        <p className="text-muted-foreground text-sm">{history.length} сохранённых сравнений</p>
      </div>

      {history.map((entry, idx) => {
        const cat = CATEGORIES.find(c => c.id === entry.category);
        const winner = entry.products.find(p => p.id === entry.winnerId);
        const others = entry.products.filter(p => p.id !== entry.winnerId);
        const worst = others.length > 0
          ? Math.max(...others.map(p => p.pricePerKg || 0))
          : 0;
        const savings = worst > 0 ? worst - (winner?.pricePerKg || 0) : 0;

        return (
          <div
            key={entry.id}
            className="card-glass rounded-2xl p-4 animate-slide-up"
            style={{ animationDelay: `${idx * 0.07}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat?.emoji || '📦'}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{cat?.label || 'Прочее'}</p>
                  <p className="text-muted-foreground text-xs">{formatDate(entry.date)}</p>
                </div>
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-full px-3 py-1">
                  <Icon name="TrendingDown" size={12} className="text-primary" />
                  <span className="text-primary text-xs font-bold">−{savings.toFixed(1)}₽</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {entry.products.map(product => {
                const isWinner = product.id === entry.winnerId;
                const ppu = product.pricePerKg || 0;
                const label = UNIT_LABEL[product.unit];
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                      isWinner ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isWinner
                        ? <Icon name="CheckCircle" size={14} className="text-primary shrink-0" />
                        : <Icon name="Circle" size={14} className="text-muted-foreground shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isWinner ? 'text-white' : 'text-muted-foreground'}`}>
                          {product.brand || product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.price}₽ / {product.amount}{product.unit}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-rubik font-bold ml-2 ${isWinner ? 'neon-green' : 'text-muted-foreground'}`}>
                      {ppu.toFixed(2)} {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
