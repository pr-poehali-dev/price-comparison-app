import { useState } from 'react';
import { Product, Unit, UNITS, UNIT_LABEL, CATEGORIES, calcPricePerUnit } from '@/types/product';
import Icon from '@/components/ui/icon';

interface CompareTabProps {
  onSave: (products: Product[], winnerId: string, category: string) => void;
  onFavorite: (product: Product) => void;
  buildProduct: (name: string, brand: string, price: number, amount: number, unit: Unit, category: string) => Product;
}

interface ProductForm {
  name: string;
  brand: string;
  price: string;
  amount: string;
  unit: Unit;
}

const emptyForm = (): ProductForm => ({ name: '', brand: '', price: '', amount: '', unit: 'кг' });

export default function CompareTab({ onSave, onFavorite, buildProduct }: CompareTabProps) {
  const [forms, setForms] = useState<ProductForm[]>([emptyForm(), emptyForm()]);
  const [category, setCategory] = useState('other');
  const [result, setResult] = useState<Product[] | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const updateForm = (i: number, field: keyof ProductForm, value: string) => {
    setForms(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
    setResult(null);
    setSaved(false);
  };

  const addProduct = () => {
    if (forms.length >= 5) return;
    setForms(prev => [...prev, emptyForm()]);
  };

  const removeProduct = (i: number) => {
    if (forms.length <= 2) return;
    setForms(prev => prev.filter((_, idx) => idx !== i));
    setResult(null);
  };

  const compare = () => {
    const products = forms.map((f, i) => {
      const price = parseFloat(f.price);
      const amount = parseFloat(f.amount);
      if (!price || !amount) return null;
      return buildProduct(f.name || `Товар ${i + 1}`, f.brand, price, amount, f.unit, category);
    }).filter(Boolean) as Product[];

    if (products.length < 2) return;

    const sorted = [...products].sort((a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0));
    setResult(products);
    setWinnerId(sorted[0].id);
    setSaved(false);
  };

  const handleSave = () => {
    if (!result || !winnerId) return;
    onSave(result, winnerId, category);
    setSaved(true);
  };

  const handleFavorite = (product: Product) => {
    onFavorite(product);
  };

  const isFormValid = forms.filter(f => f.price && f.amount).length >= 2;
  const maxPPU = result ? Math.max(...result.map(p => p.pricePerKg || 0)) : 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="card-glass rounded-2xl p-4 animate-fade-in">
        <h2 className="font-rubik font-bold text-lg text-white mb-1">Сравнение товаров</h2>
        <p className="text-muted-foreground text-sm">Добавь товары и узнай, где выгоднее</p>
      </div>

      {/* Category */}
      <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <p className="text-xs text-muted-foreground mb-2 px-1">Категория</p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.slice(1).map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${
                category === cat.id
                  ? 'tab-active font-semibold'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Forms */}
      {forms.map((form, i) => (
        <div
          key={i}
          className="card-glass rounded-2xl p-4 animate-slide-up"
          style={{ animationDelay: `${0.1 + i * 0.08}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-rubik"
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg, hsl(142 76% 50%), hsl(142 76% 35%))'
                    : i === 1
                    ? 'linear-gradient(135deg, hsl(270 80% 65%), hsl(270 80% 45%))'
                    : 'linear-gradient(135deg, hsl(30 100% 55%), hsl(30 100% 40%))',
                  color: 'white',
                }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium text-white">Товар {i + 1}</span>
            </div>
            {forms.length > 2 && (
              <button
                onClick={() => removeProduct(i)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              placeholder="Название (необязательно)"
              value={form.name}
              onChange={e => updateForm(i, 'name', e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
            <input
              type="text"
              placeholder="Марка / бренд (необязательно)"
              value={form.brand}
              onChange={e => updateForm(i, 'brand', e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Цена"
                  value={form.price}
                  onChange={e => updateForm(i, 'price', e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₽</span>
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Кол-во"
                  value={form.amount}
                  onChange={e => updateForm(i, 'amount', e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <select
                value={form.unit}
                onChange={e => updateForm(i, 'unit', e.target.value as Unit)}
                className="bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      {/* Add product button */}
      {forms.length < 5 && (
        <button
          onClick={addProduct}
          className="flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
        >
          <Icon name="Plus" size={16} />
          Добавить ещё товар
        </button>
      )}

      {/* Compare Button */}
      <button
        onClick={compare}
        disabled={!isFormValid}
        className="gradient-brand rounded-2xl py-4 font-rubik font-bold text-base text-black glow-green transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
      >
        Сравнить
      </button>

      {/* Results */}
      {result && winnerId && (
        <div className="animate-scale-in">
          <p className="text-xs text-muted-foreground mb-3 px-1 uppercase tracking-wider">Результат сравнения</p>
          <div className="flex flex-col gap-3">
            {[...result].sort((a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0)).map((product, idx) => {
              const isWinner = product.id === winnerId;
              const ppu = product.pricePerKg || 0;
              const barWidth = maxPPU > 0 ? (ppu / maxPPU) * 100 : 100;
              const unit = UNIT_LABEL[product.unit];

              return (
                <div
                  key={product.id}
                  className={`rounded-2xl p-4 border transition-all duration-300 ${
                    isWinner
                      ? 'border-primary/50 bg-primary/10 glow-green'
                      : 'card-glass'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {isWinner && (
                          <span className="bg-primary text-black text-xs font-rubik font-bold px-2 py-0.5 rounded-full">
                            ВЫГОДНЕЕ
                          </span>
                        )}
                        {idx === result.length - 1 && !isWinner && (
                          <span className="bg-destructive/20 text-destructive text-xs font-rubik font-bold px-2 py-0.5 rounded-full border border-destructive/30">
                            ДОРОЖЕ
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold">{product.name}</p>
                      <p className="text-muted-foreground text-sm">{product.brand}</p>
                    </div>
                    <button
                      onClick={() => handleFavorite(product)}
                      className="text-muted-foreground hover:text-yellow-400 transition-colors p-1"
                    >
                      <Icon name="Star" size={18} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <span className="text-white font-rubik font-bold text-xl">{product.price}₽</span>
                      <span className="text-muted-foreground text-sm ml-1.5">/ {product.amount} {product.unit}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-rubik font-bold text-lg ${isWinner ? 'neon-green' : 'text-destructive'}`}
                      >
                        {ppu.toFixed(2)}₽
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">{unit}</span>
                    </div>
                  </div>

                  {/* Bar chart */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bar-chart-fill ${isWinner ? 'bg-primary' : 'bg-destructive'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings block */}
          {result.length >= 2 && (() => {
            const sorted = [...result].sort((a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0));
            const best = sorted[0].pricePerKg || 0;
            const worst = sorted[sorted.length - 1].pricePerKg || 0;
            const diff = worst - best;
            const diffPct = worst > 0 ? ((diff / worst) * 100).toFixed(0) : '0';
            return (
              <div className="mt-3 rounded-2xl p-4 bg-primary/10 border border-primary/30">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="TrendingDown" size={16} className="text-primary" />
                  <span className="text-primary font-rubik font-semibold text-sm">Экономия</span>
                </div>
                <p className="text-white text-sm">
                  Выбрав лучший вариант, вы экономите{' '}
                  <span className="neon-green font-bold">{diff.toFixed(2)}₽</span> за единицу
                  {' '}(<span className="neon-green font-bold">{diffPct}%</span> дешевле)
                </p>
              </div>
            );
          })()}

          {/* Save button */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 border ${
                saved
                  ? 'border-primary/30 text-primary bg-primary/10'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
              }`}
            >
              <Icon name={saved ? 'CheckCircle' : 'BookmarkPlus'} size={16} />
              {saved ? 'Сохранено' : 'В историю'}
            </button>
            <button
              onClick={() => {
                if (!result || !winnerId) return;
                const winner = result.find(p => p.id === winnerId);
                if (winner) handleFavorite(winner);
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border border-border text-muted-foreground hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200"
            >
              <Icon name="Star" size={16} />
              В избранное
            </button>
          </div>
        </div>
      )}
    </div>
  );
}