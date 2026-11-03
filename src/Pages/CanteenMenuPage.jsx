import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import pub, { mediaUrl, useLang } from "../utils/api";
import { UtensilsCrossed, Clock, Flame, Scale, Coffee, Soup, Cookie, Sparkles } from "lucide-react";

const NAVY   = '#0f172a';
const ORANGE = '#ea6c0a';
const UI = {
    latin: { title: 'Haftalik ovqatlanish jadvali', empty: 'Menyu topilmadi', noFoods: 'Bu kun uchun taomlar kiritilmagan', total: 'Kunlik jami narx' },
    cyril: { title: 'Ҳафталик овқатланиш жадвали', empty: 'Меню топилмади', noFoods: 'Бу кун учун таомлар киритилмаган', total: 'Кунлик жами нарх' },
    ru: { title: 'Еженедельное меню', empty: 'Меню не найдено', noFoods: 'На этот день блюда не добавлены', total: 'Итого за день' },
};

const DARK_BG   = '#0a0f1c';
const CARD_BG   = '#151d32';
const CARD_BORDER = '#1e2d4a';

const WEEKDAYS = {
    latin: ['Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba','Yakshanba'],
    cyril: ['Душанба','Сешанба','Чоршанба','Пайшанба','Жума','Шанба','Якшанба'],
    ru:    ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'],
};
const WEEKDAYS_SHORT = {
    latin: ['Dush','Sesh','Chor','Pay','Juma','Shan','Yak'],
    cyril: ['Душ','Сеш','Чор','Пай','Жум','Шан','Якш'],
    ru:    ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
};

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const MEAL_META = {
    breakfast: { label: 'Nonushta',       order: 0, icon: Coffee },
    lunch:     { label: 'Tushlik',        order: 1, icon: Soup },
    snack:     { label: "Yengil tamaddi", order: 2, icon: Cookie },
};
const MEAL_KEYS = Object.keys(MEAL_META);

// JS Date.getDay(): 0 = Sunday … 6 = Saturday. Our day_of_week is 0 = Monday.
const TODAY_INDEX = (new Date().getDay() + 6) % 7;

function normalizeMenus(payload) {
    const source = payload?.data || payload?.items || payload;
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];

    return DAY_KEYS.flatMap((day, dayIndex) => {
        const dayData = source[day];
        if (!dayData || typeof dayData !== 'object') return [];
        const items = MEAL_KEYS.flatMap(meal => {
            const slot = dayData[meal];
            if (!slot || !Array.isArray(slot.foods)) return [];
            return slot.foods.map(food => ({
                ...food,
                meal,
                start_time: slot.start_time,
                end_time: slot.end_time,
            }));
        });
        return items.length ? [{ ...source, id: `${source.id || 'menu'}-${day}`, day_of_week: dayIndex, items }] : [];
    });
}

const CANTEEN_STYLES = `
@keyframes cm-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cm-panel { animation: cm-fade-in 0.35s ease both; }
.cm-meal-group { animation: cm-fade-in 0.35s ease both; }
.cm-food-card {
  animation: cm-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}
.cm-food-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px -16px rgba(15, 23, 42, 0.25);
  border-color: #fed7aa !important;
}
.cm-day-btn {
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
@media (prefers-reduced-motion: reduce) {
  .cm-panel, .cm-meal-group, .cm-food-card, .cm-day-btn { animation: none !important; transition: none !important; }
}
`;

function useCanteenStyles() {
    useEffect(() => {
        if (document.getElementById('cm-styles')) return;
        const style = document.createElement('style');
        style.id = 'cm-styles';
        style.textContent = CANTEEN_STYLES;
        document.head.appendChild(style);
    }, []);
}

export default function CanteenMenuPage() {
    const { t } = useTranslation();
    const lang  = useLang(); // 'latin' | 'cyril' | 'ru' — reactive
    const ui = UI[lang] || UI.latin;
    useCanteenStyles();

    const [menus,      setMenus]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [activeDay,  setActiveDay]  = useState(null);

    useEffect(() => {
        pub.get('/api/canteen-menu/public/active')
            .then(res => {
                const normalized = normalizeMenus(res.data);
                setMenus(normalized);
                if (normalized.length) {
                    const hasToday = normalized.some(m => (m.day_of_week ?? 0) === TODAY_INDEX);
                    setActiveDay(hasToday ? TODAY_INDEX : (normalized[0].day_of_week ?? 0));
                }
            })
            .catch(() => setMenus([]))
            .finally(() => setLoading(false));
    }, []);

    const nk = `name_${lang}`;
    const dk = `description_${lang}`;

    function weekdayName(idx) {
        return (WEEKDAYS[lang] || WEEKDAYS.latin)[idx] || '';
    }
    function weekdayShort(idx) {
        return (WEEKDAYS_SHORT[lang] || WEEKDAYS_SHORT.latin)[idx] || '';
    }

    const sortedMenus = useMemo(
        () => [...menus].sort((a, b) => (a.day_of_week ?? 0) - (b.day_of_week ?? 0)),
        [menus]
    );

    const activeMenu = sortedMenus.find(m => (m.day_of_week ?? 0) === activeDay) || sortedMenus[0];

    const groupedMeals = useMemo(() => {
        if (!activeMenu) return [];
        const items = activeMenu.items || activeMenu.menu_items || [];
        const groups = {};
        items.forEach(item => {
            const key = item.meal || 'other';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return Object.entries(groups).sort(
            (a, b) => (MEAL_META[a[0]]?.order ?? 99) - (MEAL_META[b[0]]?.order ?? 99)
        );
    }, [activeMenu]);

    const dayItemCount = idx => {
        const m = sortedMenus.find(m => (m.day_of_week ?? 0) === idx);
        return (m?.items || m?.menu_items || []).length;
    };

    return (
        <div>
            <section className="py-20" style={{ background: DARK_BG, minHeight: '60vh', marginTop:'100px' }}>
                <div className="Container">

                    {/* ── heading ── */}
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
                        <div>
                            <span className="inline-flex items-center gap-2 font-semibold tracking-widest uppercase text-xs mb-2" style={{ color: ORANGE }}>
                                <UtensilsCrossed size={14} strokeWidth={2.2} aria-hidden="true" />
                                {t('Oshxonamenyusi') || 'Oshxona menyusi'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: '#f1f5f9' }}>
                                {ui.title}
                            </h1>
                            <div className="w-14 h-1 rounded-full mt-3" style={{ background: ORANGE }} />
                        </div>
                       
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : sortedMenus.length === 0 ? (
                        <div className="text-center py-20" style={{ color: '#94a3b8' }}>
                            <UtensilsCrossed size={48} strokeWidth={1.5} className="mx-auto mb-4" aria-hidden="true" />
                            <p className="text-lg">{ui.empty}</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-[220px_1fr] gap-6">

                            {/* ── kun tanlash ── */}
                            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                                {sortedMenus.map((menu, idx) => {
                                    const dIdx = menu.day_of_week ?? idx;
                                    const active = dIdx === activeDay;
                                    const isToday = dIdx === TODAY_INDEX;
                                    const count = dayItemCount(dIdx);
                                    return (
                                        <button
                                            key={dIdx}
                                            type="button"
                                            onClick={() => setActiveDay(dIdx)}
                                            className="cm-day-btn flex-shrink-0 lg:w-full flex items-center justify-between gap-2 text-left px-4 py-3 rounded-2xl font-semibold text-sm"
                                            style={{
                                                background: active ? ORANGE : CARD_BG,
                                                color: active ? '#fff' : '#94a3b8',
                                                border: `1px solid ${active ? ORANGE : CARD_BORDER}`,
                                                boxShadow: active ? `0 8px 20px -8px rgba(234,108,10,0.5)` : 'none'
                                            }}
                                        >
                                            <span className="flex items-center gap-2 whitespace-nowrap">
                                                <span className="lg:hidden">{weekdayShort(dIdx)}</span>
                                                <span className="hidden lg:inline">{weekdayName(dIdx)}</span>
                                                {isToday && (
                                                    <span
                                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                                        style={{
                                                            background: active ? 'rgba(255,255,255,0.2)' : 'rgba(234,108,10,0.15)',
                                                            color: active ? '#fff' : ORANGE
                                                        }}
                                                    >
                                                        Bugun
                                                    </span>
                                                )}
                                            </span>
                                            {count > 0 && (
                                                <span
                                                    className="hidden lg:inline text-xs font-semibold flex-shrink-0"
                                                    style={{ color: active ? 'rgba(255,255,255,0.7)' : '#475569' }}
                                                >
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── tanlangan kunning menyusi ── */}
                            {activeMenu && (
                                <div
                                    key={activeDay}
                                    className="cm-panel rounded-3xl overflow-hidden w-full"
                                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                                >
                                    {/* cover image */}
                                    {activeMenu.cover_image && (
                                        <div className="relative h-44 overflow-hidden">
                                            <img src={mediaUrl(activeMenu.cover_image)} alt=""
                                                className="w-full h-full object-cover" />
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(21,29,50,0.8), transparent 60%)' }} />
                                            <h2 className="absolute bottom-4 left-5 text-white font-bold text-xl">
                                                {weekdayName(activeMenu.day_of_week)}
                                            </h2>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {!activeMenu.cover_image && (
                                            <h2 className="font-bold text-xl mb-5" style={{ color: '#f1f5f9' }}>
                                                {weekdayName(activeMenu.day_of_week)}
                                            </h2>
                                        )}

                                        {groupedMeals.length === 0 ? (
                                            <p className="text-sm py-6 text-center" style={{ color: '#64748b' }}>{ui.noFoods}</p>
                                        ) : (
                                            <div className="flex flex-col gap-6">
                                                {groupedMeals.map(([mealKey, foods], groupIdx) => {
                                                    const MealIcon = MEAL_META[mealKey]?.icon || UtensilsCrossed;
                                                    return (
                                                        <div key={mealKey} className="cm-meal-group" style={{ animationDelay: `${groupIdx * 60}ms` }}>
                                                            {/* meal section header */}
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                                    style={{ background: 'rgba(234,108,10,0.15)', color: ORANGE }}>
                                                                    <MealIcon size={14} strokeWidth={2} aria-hidden="true" />
                                                                </span>
                                                                <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: ORANGE }}>
                                                                    {({ breakfast: lang === 'ru' ? 'Завтрак' : lang === 'cyril' ? 'Нонушта' : 'Nonushta', lunch: lang === 'ru' ? 'Обед' : lang === 'cyril' ? 'Тушлик' : 'Tushlik', snack: lang === 'ru' ? 'Легкий перекус' : lang === 'cyril' ? 'Енгил тамадди' : 'Yengil tamaddi' }[mealKey]) || MEAL_META[mealKey]?.label || mealKey}
                                                                </h3>
                                                                {foods[0]?.start_time && foods[0]?.end_time && foods[0].start_time !== '00:00' && (
                                                                    <span className="text-xs ml-auto flex items-center gap-1" style={{ color: '#475569' }}>
                                                                        <Clock size={12} aria-hidden="true" />
                                                                        {foods[0].start_time} – {foods[0].end_time}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* food items */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                                                {foods.map((item, i) => (
                                                                    <div key={i}
                                                                        className="cm-food-card relative rounded-2xl p-4 overflow-hidden"
                                                                        style={{ background: '#0d1526', border: `1px solid ${CARD_BORDER}`, animationDelay: `${i * 45}ms` }}
                                                                    >
                                                                        <div
                                                                            className="absolute top-0 left-0 w-1 h-full"
                                                                            style={{ background: `linear-gradient(${ORANGE}, #fbbf24)` }}
                                                                        />
                                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                                            <span className="block font-bold text-sm leading-snug pr-1" style={{ color: '#f1f5f9' }}>
                                                                                {item[nk] || item.name_latin || item.name || '—'}
                                                                            </span>
                                                                            {item.price && (
                                                                                <span
                                                                                    className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                                                                                    style={{ background: 'rgba(234,108,10,0.15)', color: ORANGE }}
                                                                                >
                                                                                    {item.price.toLocaleString()} so'm
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {(item.calories || item.weight) && (
                                                                            <div className="flex items-center gap-2 mt-2">
                                                                                {item.weight && (
                                                                                    <span
                                                                                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
                                                                                        style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', border: `1px solid ${CARD_BORDER}` }}
                                                                                    >
                                                                                        <Scale size={10} aria-hidden="true" /> {item.weight}g
                                                                                    </span>
                                                                                )}
                                                                                {item.calories && (
                                                                                    <span
                                                                                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
                                                                                        style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', border: `1px solid ${CARD_BORDER}` }}
                                                                                    >
                                                                                        <Flame size={10} aria-hidden="true" /> {item.calories} kkal
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {activeMenu[dk] && (
                                            <p className="mt-5 text-sm" style={{ color: '#64748b' }}>{activeMenu[dk]}</p>
                                        )}

                                        {activeMenu.total_price && (
                                            <div className="mt-6 pt-4 flex justify-between items-center" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                                                <span className="text-sm" style={{ color: '#64748b' }}>{ui.total}</span>
                                                <span className="font-bold text-lg" style={{ color: ORANGE }}>
                                                    {activeMenu.total_price.toLocaleString()} so'm
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}