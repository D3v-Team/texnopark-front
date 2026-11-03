import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import pub, { useLang } from "../utils/api";

const NAVY   = '#e8eefb';
const ORANGE = '#ea6c0a';
const CREAM  = '#faf8f4';
const GREEN  = '#16a34a';
const UI = {
    latin: { eyebrow: 'Kun tartibi', title: 'Uchrashuvlar', empty: 'Uchrashuvlar topilmadi', today: 'Bugun', past: "O'tdi", next: 'Kutilmoqda' },
    cyril: { eyebrow: 'Кун тартиби', title: 'Учрашувлар', empty: 'Учрашувлар топилмади', today: 'Бугун', past: 'Ўтди', next: 'Кутилмоқда' },
    ru: { eyebrow: 'Расписание', title: 'Встречи', empty: 'Встречи не найдены', today: 'Сегодня', past: 'Завершено', next: 'Предстоит' },
};

export default function MeetingsPage() {
    const { t } = useTranslation();
    const lang  = useLang(); // 'latin' | 'cyril' | 'ru' — reactive
    const ui = UI[lang] || UI.latin;

    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pub.get('/api/meetings', { params: { limit: 50, is_public: true } })
            .then(res => setItems(res.data?.data || res.data?.items || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    // useLang() returns 'latin' | 'cyril' | 'ru' — matches API field suffixes
    const tk = `title_${lang}`;
    const dk = `description_${lang}`;

    const WEEKDAY = {
        latin: ['Yak','Dush','Sesh','Chor','Pay','Jum','Shan'],
        cyrl:  ['Якш','Душ','Сеш','Чор','Пай','Жум','Шан'],
        ru:    ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    };
    const MONTH_SHORT = {
        latin: ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'],
        cyrl:  ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
        ru:    ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    };
    function monthShort(d) {
        return (MONTH_SHORT[lang] || MONTH_SHORT.latin)[d.getMonth()] || '';
    }
    function weekday(d) {
        return (WEEKDAY[lang] || WEEKDAY.latin)[d.getDay()] || '';
    }

    const sorted = [...items].sort((a, b) => {
        const da = new Date(a.meeting_date || a.date || a.event_date || 0);
        const db = new Date(b.meeting_date || b.date || b.event_date || 0);
        return db - da;
    });

    return (
        <div>
            <style>{`
                @keyframes meetingPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(234,108,10,0.35); }
                    50%      { box-shadow: 0 0 0 6px rgba(234,108,10,0); }
                }
                .meeting-card { transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s cubic-bezier(.2,.8,.2,1); }
                .meeting-card:hover { transform: translate(-5px,-5px); box-shadow: 10px 10px 0 #ea6c0a !important; }
                .meeting-dot--today { animation: meetingPulse 1.8s ease-in-out infinite; }
                .meeting-page-surface { background: #0a0f1c !important; }
                html.dark .meeting-page-surface { background: #0a0f1c !important; }
                .meeting-page-surface h1 { color: #f8fafc !important; }
                @media (max-width: 640px) {
                    .meeting-card-inner { flex-direction: column !important; }
                    .meeting-card-date  { width: 100% !important; min-height: 70px !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; gap: 12px !important; padding: 16px !important; }
                }
            `}</style>

            <section style={{ marginTop: '120px', minHeight: '60vh' }} className="meeting-page-surface py-14">
                <div className="Container max-w-3xl mx-auto">

                    {/* ── sarlavha ── */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold mt-1" style={{ color: '#f8fafc' }}>
                            {ui.title}
                        </h1>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 rounded-full animate-spin"
                                style={{ border: `3px solid rgba(234,108,10,0.15)`, borderTopColor: ORANGE }} />
                        </div>
                    ) : sorted.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mx-auto mb-4" style={{ width: 48, height: 48, borderRadius: '50%', border: `1.5px dashed #334155` }} />
                            <p className="text-lg font-semibold" style={{ color: '#94a3b8' }}>{ui.empty}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {sorted.map((item, idx) => {
                                const rawDate = item.meeting_date || item.date || item.event_date;
                                const d = rawDate ? new Date(rawDate) : null;
                                const valid = d && !isNaN(d);
                                const now = new Date();
                                const isPast   = valid && d < now;
                                const isToday  = valid && d.toDateString() === now.toDateString();
                                const isActive = valid && d >= now;

                                const statusLabel = isToday ? ui.today : isPast ? ui.past : isActive ? ui.next : '';
                                const dotColor    = isToday ? ORANGE : isPast ? '#475569' : GREEN;
                                const accentColor = isToday ? ORANGE : isPast ? '#475569' : GREEN;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="meeting-card rounded-[20px] overflow-hidden"
                                        style={{
                                            background: '#151d32',
                                            border: `2px solid #1e2d4a`,
                                            boxShadow: `6px 6px 0 #0d1526`,
                                            opacity: isPast ? 0.72 : 1,
                                        }}
                                    >
                                        <div className="meeting-card-inner flex" style={{ minHeight: 130 }}>

                                            {/* ── CHAP: Sana bloki ── */}
                                            <div
                                                className="meeting-card-date flex-shrink-0 flex flex-col items-center justify-center px-5 py-4 gap-0.5"
                                                style={{
                                                    width: 100,
                                                    background: isPast ? '#0f1a2e' : `linear-gradient(160deg, #151d32 0%, #0d1526 100%)`,
                                                    borderRight: `2px solid #1e2d4a`,
                                                }}
                                            >
                                                {valid ? (
                                                    <>
                                                        <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>
                                                            {weekday(d)}
                                                        </span>
                                                        <span className="font-black leading-none" style={{ fontSize: 36, color: isPast ? '#475569' : '#f1f5f9', fontFamily: 'Georgia, serif' }}>
                                                            {d.getDate()}
                                                        </span>
                                                        <span className="text-[11px] font-semibold" style={{ color: isPast ? '#475569' : '#64748b' }}>
                                                            {monthShort(d)}
                                                        </span>
                                                        <span className="text-[10px]" style={{ color: isPast ? '#334155' : '#475569' }}>
                                                            {d.getFullYear()}
                                                        </span>
                                                        {/* status dot */}
                                                        <span
                                                            className={`rounded-full mt-2 ${isToday ? 'meeting-dot--today' : ''}`}
                                                            style={{ width: 8, height: 8, background: dotColor, display: 'block' }}
                                                        />
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: 28 }}>📅</span>
                                                )}
                                            </div>

                                            {/* ── O'NG: Kontent ── */}
                                            <div className="flex flex-col justify-center flex-1 px-5 py-5" style={{ minWidth: 0 }}>

                                                {/* accent chiziq */}
                                                <div style={{ height: 3, width: 36, borderRadius: 99, background: accentColor, marginBottom: 10 }} />

                                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                    <h3 className="font-extrabold text-base leading-tight" style={{ color: '#f1f5f9' }}>
                                                        {item[tk] || item.title_latin || 'Uchrashuv'}
                                                    </h3>
                                                    {statusLabel && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
                                                            style={{
                                                                color: isToday ? ORANGE : isPast ? '#475569' : GREEN,
                                                                background: isToday ? 'rgba(234,108,10,0.12)' : isPast ? 'rgba(71,85,105,0.15)' : 'rgba(22,163,74,0.12)',
                                                                border: `1px solid ${isToday ? 'rgba(234,108,10,0.25)' : isPast ? 'rgba(71,85,105,0.25)' : 'rgba(22,163,74,0.25)'}`,
                                                            }}>
                                                            {statusLabel}
                                                        </span>
                                                    )}
                                                </div>

                                                {item[dk] && (
                                                    <p className="text-sm mb-3 line-clamp-2" style={{ color: '#94a3b8' }}>
                                                        {item[dk]}
                                                    </p>
                                                )}

                                                {/* info chips */}
                                                <div className="flex flex-wrap gap-2">
                                                    {(item.start_time || item.time) && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(234,108,10,0.08)', color: '#cbd5e1', border: '1px solid rgba(234,108,10,0.18)' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <polyline points="12 6 12 12 16 14"/>
                                                            </svg>
                                                            <span className="font-semibold">{item.start_time || item.time}</span>
                                                        </div>
                                                    )}
                                                    {item.location && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                                <circle cx="12" cy="10" r="3"/>
                                                            </svg>
                                                            {item.location}
                                                        </div>
                                                    )}
                                                    {item.grade && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
                                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                                            </svg>
                                                            {item.grade}-sinf
                                                        </div>
                                                    )}
                                                    {item.teacher_name && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2">
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                                <circle cx="12" cy="7" r="4"/>
                                                            </svg>
                                                            {item.teacher_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── O'NG chegara aksent ── */}
                                            <div style={{ width: 4, flexShrink: 0, background: `linear-gradient(to bottom, ${accentColor}, transparent)`, opacity: 0.7 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}