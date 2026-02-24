import Icon from '@/components/ui/icon';

interface ProfileTabProps {
  totalSaved: number;
  historyCount: number;
  favoritesCount: number;
}

const NOTIFICATIONS = [
  { id: 1, text: 'Молоко Простоквашино подешевело на 8₽', time: '2 часа назад', emoji: '🥛' },
  { id: 2, text: 'Новая акция на сахар в Пятёрочке', time: 'Вчера', emoji: '🍬' },
  { id: 3, text: 'Масло подсолнечное −15% на этой неделе', time: '2 дня назад', emoji: '🫙' },
];

const STATS = [
  { label: 'Сравнений', value: (count: number) => count.toString(), key: 'history', icon: 'BarChart3' as const },
  { label: 'В избранном', value: (count: number) => count.toString(), key: 'favorites', icon: 'Star' as const },
];

export default function ProfileTab({ totalSaved, historyCount, favoritesCount }: ProfileTabProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Profile header */}
      <div className="card-glass rounded-2xl p-5 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-2xl glow-green">
            👤
          </div>
          <div>
            <h2 className="font-rubik font-bold text-white text-lg">Мой профиль</h2>
            <p className="text-muted-foreground text-sm">Умный покупатель</p>
          </div>
        </div>

        {/* Savings highlight */}
        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="PiggyBank" size={18} className="text-primary" />
            <span className="text-primary text-sm font-semibold">Общая экономия</span>
          </div>
          <p className="text-3xl font-rubik font-black neon-green">{totalSaved.toFixed(2)}₽</p>
          <p className="text-muted-foreground text-xs mt-0.5">за всё время использования</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card-glass rounded-2xl p-4">
          <Icon name="BarChart3" size={20} className="text-accent mb-2" />
          <p className="text-2xl font-rubik font-bold text-white">{historyCount}</p>
          <p className="text-muted-foreground text-sm">Сравнений</p>
        </div>
        <div className="card-glass rounded-2xl p-4">
          <Icon name="Star" size={20} className="text-yellow-400 mb-2" />
          <p className="text-2xl font-rubik font-bold text-white">{favoritesCount}</p>
          <p className="text-muted-foreground text-sm">В избранном</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Bell" size={16} className="text-accent" />
            <p className="text-white font-semibold text-sm">Уведомления</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
            {NOTIFICATIONS.length}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {NOTIFICATIONS.map((notif, idx) => (
            <div
              key={notif.id}
              className="card-glass rounded-xl p-3 flex items-start gap-3 animate-slide-up"
              style={{ animationDelay: `${0.2 + idx * 0.07}s` }}
            >
              <span className="text-xl shrink-0">{notif.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm leading-snug">{notif.text}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{notif.time}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 animate-pulse-soft" />
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="card-glass rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {[
          { icon: 'Bell', label: 'Уведомления о скидках', right: 'Вкл' },
          { icon: 'MapPin', label: 'Мои магазины', right: '3 магазина' },
          { icon: 'Moon', label: 'Тёмная тема', right: 'Вкл' },
          { icon: 'Info', label: 'О приложении', right: 'v1.0' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <Icon name={item.icon} fallback="Settings" size={18} className="text-muted-foreground" />
              <span className="text-white text-sm">{item.label}</span>
            </div>
            <span className="text-muted-foreground text-sm">{item.right}</span>
          </button>
        ))}
      </div>
    </div>
  );
}