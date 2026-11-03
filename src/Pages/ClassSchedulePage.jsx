import { useEffect, useState } from "react";
import pub, { useLang } from "../utils/api";
import { CalendarX2, Clock, MapPin, BookOpen, GraduationCap, ArrowLeft } from "lucide-react";

const ORANGE = '#ea6c0a';
const DARK   = '#0a0f1c';
const CARD   = '#151d32';
const BORDER = '#1e2d4a';

const DAYS = [
    { key: 'monday',    latin: 'Dushanba',   cyril: 'Душанба',   ru: 'Понедельник', short_latin: 'Du', short_cyril: 'Ду', short_ru: 'Пн' },
    { key: 'tuesday',   latin: 'Seshanba',   cyril: 'Сешанба',   ru: 'Вторник',     short_latin: 'Se', short_cyril: 'Се', short_ru: 'Вт' },
    { key: 'wednesday', latin: 'Chorshanba', cyril: 'Чоршанба',  ru: 'Среда',       short_latin: 'Ch', short_cyril: 'Чо', short_ru: 'Ср' },
    { key: 'thursday',  latin: 'Payshanba',  cyril: 'Пайшанба',  ru: 'Четверг',     short_latin: 'Pa', short_cyril: 'Па', short_ru: 'Чт' },
    { key: 'friday',    latin: 'Juma',       cyril: 'Жума',      ru: 'Пятница',     short_latin: 'Ju', short_cyril: 'Жу', short_ru: 'Пт' },
    { key: 'saturday',  latin: 'Shanba',     cyril: 'Шанба',     ru: 'Суббота',     short_latin: 'Sh', short_cyril: 'Ша', short_ru: 'Сб' },
];

const DAY_COLORS = [
    '#3b82f6', '#8b5cf6', '#ea6c0a',
    '#10b981', '#ec4899', '#f59e0b',
];

const GRADE_COLORS = [
    { accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' },
    { accent: '#ea6c0a', bg: 'rgba(234,108,10,0.12)', border: 'rgba(234,108,10,0.25)' },
    { accent: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    { accent: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' },
    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
    { accent: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)'  },
    { accent: '#84cc16', bg: 'rgba(132,204,22,0.12)', border: 'rgba(132,204,22,0.25)' },
];

const UI = {
    latin: { title: 'Dars jadvali', pick: "Sinf tanlang", empty: 'Jadval topilmadi', lessons: "ta dars", room: 'Xona', time: 'Vaqt', subject: 'Fan', back: 'Orqaga', noLessons: "Darslar yo'q", scheduleOf: 'Dars jadvali' },
    cyril: { title: 'Дарс жадвали', pick: 'Синф танланг', empty: 'Жадвал топилмади', lessons: 'та дарс', room: 'Хона', time: 'Вақт', subject: 'Фан', back: 'Орқага', noLessons: 'Дарслар йўқ', scheduleOf: 'Дарс жадвали' },
    ru:    { title: 'Расписание', pick: 'Выберите класс', empty: 'Расписание не найдено', lessons: 'уроков', room: 'Кабинет', time: 'Время', subject: 'Предмет', back: 'Назад', noLessons: 'Уроков нет', scheduleOf: 'Расписание' },
};

export default function ClassSchedulePage() {
    const lang = useLang();
    const ui   = UI[lang] || UI.latin;
    const sk   = `subject_${lang}`;

    const dayLabel = (d) => d[lang] || d.latin;
    const dayShort = (d) => d[`short_${lang}`] || d.short_latin;

    const [grades,        setGrades]        = useState([]);
    const [gradesLoad,    setGradesLoad]    = useState(true);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [schedule,      setSchedule]      = useState(null);
    const [schedLoad,     setSchedLoad]     = useState(false);
    const [activeDay,     setActiveDay]     = useState('monday');

    useEffect(() => {
        pub.get('/api/class-schedule/find-all-grades/public', { params: { limit: 100 } })
            .then(res => setGrades(res.data?.data || res.data?.items || []))
            .catch(() => setGrades([]))
            .finally(() => setGradesLoad(false));
    }, []);

    useEffect(() => {
        if (!selectedGrade) return;
        setSchedLoad(true);
        setSchedule(null);
        pub.get('/api/class-schedule/public', { params: { grade: selectedGrade.grade } })
            .then(res => {
                const d = res.data?.data || res.data;
                const sched = d?.schedule || d;
                setSchedule(sched);
                const first = DAYS.find(day => (sched[day.key] || []).length > 0);
                if (first) setActiveDay(first.key);
            })
            .catch(() => setSchedule(null))
            .finally(() => setSchedLoad(false));
    }, [selectedGrade]);

    const availDays  = schedule ? DAYS.filter(d => (schedule[d.key] || []).length > 0) : [];
    const dayLessons = (schedule && schedule[activeDay]) ? [...schedule[activeDay]].sort((a,b)=>(a.lesson_number??0)-(b.lesson_number??0)) : [];
    const activeDayColor = DAY_COLORS[availDays.findIndex(d => d.key === activeDay) % DAY_COLORS.length] || ORANGE;

    return (
        <div style={{ background: DARK, minHeight: '100vh' }}>
            <style>{`
                .cls-grade-card {
                    transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s ease;
                    cursor: pointer;
                }
                .cls-grade-card:hover {
                    transform: translateY(-8px) scale(1.025);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
                }
                .cls-day-btn { transition: all 0.22s cubic-bezier(0.16,1,0.3,1); }
                .cls-day-btn:hover { transform: translateX(3px); }
                .cls-row { transition: background 0.15s ease; }
                .cls-row:hover { background: rgba(255,255,255,0.03) !important; }
                .cls-grade-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
                    gap: 18px;
                }
                .cls-schedule-grid {
                    display: grid;
                    grid-template-columns: minmax(180px, 0.28fr) minmax(0, 1fr);
                    align-items: start;
                    gap: 20px;
                }
                .cls-days-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    position: sticky;
                    top: 24px;
                }
                @media (max-width: 767px) {
                    .cls-schedule-grid { grid-template-columns: 1fr; gap: 14px; }
                    .cls-days-panel {
                        flex-direction: row;
                        overflow-x: auto;
                        position: static;
                        padding-bottom: 3px;
                        scrollbar-width: thin;
                    }
                    .cls-days-panel .cls-day-btn { flex: 1 0 112px; }
                }
                @keyframes cls-in {
                    from { opacity: 0; transform: translateY(14px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)  scale(1); }
                }
                .cls-anim { animation: cls-in 0.4s cubic-bezier(0.16,1,0.3,1) both; }
            `}</style>

            <section className="py-14" style={{ marginTop: '120px' }}>
                <div className="Container">

                    {/* Sarlavha */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: '#f1f5f9' }}>
                            {ui.title}
                        </h1>
                        <div style={{ width: 56, height: 4, borderRadius: 99, background: ORANGE, marginTop: 12 }} />
                    </div>

                    {/* Loading */}
                    {gradesLoad && (
                        <div className="flex justify-center py-24">
                            <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${BORDER}`, borderTopColor: ORANGE }} className="animate-spin" />
                        </div>
                    )}

                    {/* Bo'sh */}
                    {!gradesLoad && grades.length === 0 && (
                        <div className="text-center py-24">
                            <CalendarX2 size={52} strokeWidth={1.2} style={{ color:'#334155', margin:'0 auto 14px' }} />
                            <p style={{ color:'#64748b', fontSize:'1.05rem' }}>{ui.empty}</p>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════
                        SINF TANLASH EKRANI
                    ═══════════════════════════════════════ */}
                    {!gradesLoad && grades.length > 0 && !selectedGrade && (
                        <div className="cls-anim">
                            <p style={{ color:'#64748b', fontSize:'0.9rem', fontWeight:600, marginBottom:24 }}>
                                {ui.pick}
                            </p>
                            <div className="cls-grade-grid">
                                {grades.map((g, i) => {
                                    const c = GRADE_COLORS[i % GRADE_COLORS.length];
                                    return (
                                        <button
                                            key={g.id}
                                            onClick={() => setSelectedGrade(g)}
                                            className="cls-grade-card cls-anim text-left"
                                            style={{
                                                background: CARD,
                                                border: `2px solid ${BORDER}`,
                                                borderRadius: 20,
                                                overflow: 'hidden',
                                                padding: 0,
                                                boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                                                animationDelay: `${i * 50}ms`,
                                            }}
                                        >
                                            {/* Rang bant */}
                                            <div style={{ height: 5, background: c.accent }} />

                                            <div style={{ padding: '24px 26px 26px' }}>
                                                {/* Ikon */}
                                                <div style={{
                                                    width: 56, height: 56, borderRadius: 16,
                                                    background: c.bg, border: `2px solid ${c.border}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    marginBottom: 18,
                                                }}>
                                                    <GraduationCap size={26} strokeWidth={1.8} color={c.accent} />
                                                </div>

                                                {/* Sinf nomi */}
                                                <p style={{
                                                    color: '#f1f5f9', fontWeight: 900,
                                                    fontSize: '1.5rem', lineHeight: 1.1,
                                                    marginBottom: 4,
                                                    fontFamily: 'Georgia, serif',
                                                }}>
                                                    {g.grade}
                                                </p>

                                                {/* Jadvalga o'tish hint */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'space-between', marginTop: 16,
                                                    paddingTop: 14,
                                                    borderTop: `1px solid ${c.border}`,
                                                }}>
                                                    <span style={{ color: c.accent, fontSize: '0.82rem', fontWeight: 700 }}>
                                                        {ui.scheduleOf}
                                                    </span>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: c.bg, border: `1.5px solid ${c.border}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.5">
                                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════
                        JADVAL EKRANI
                    ═══════════════════════════════════════ */}
                    {!gradesLoad && selectedGrade && (
                        <div className="cls-anim">

                            {/* Orqaga + sinf nomi header */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                marginBottom: 28, flexWrap: 'wrap',
                            }}>
                                <button
                                    onClick={() => { setSelectedGrade(null); setSchedule(null); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: CARD, color: '#94a3b8',
                                        border: `1.5px solid ${BORDER}`,
                                        borderRadius: 12, padding: '8px 16px',
                                        fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#475569'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
                                >
                                    <ArrowLeft size={15} strokeWidth={2.2} />
                                    {ui.back}
                                </button>

                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: `${ORANGE}12`, border: `2px solid ${ORANGE}35`,
                                    borderRadius: 14, padding: '8px 20px',
                                }}>
                                    <GraduationCap size={18} strokeWidth={2} color={ORANGE} />
                                    <span style={{ color: ORANGE, fontWeight: 900, fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>
                                        {selectedGrade.grade}
                                    </span>
                                </div>
                            </div>

                            {schedLoad ? (
                                <div className="flex justify-center py-24">
                                    <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${BORDER}`, borderTopColor: ORANGE }} className="animate-spin" />
                                </div>
                            ) : !schedule || availDays.length === 0 ? (
                                <div className="text-center py-24">
                                    <CalendarX2 size={44} strokeWidth={1.2} style={{ color:'#334155', margin:'0 auto 12px' }} />
                                    <p style={{ color:'#64748b' }}>{ui.empty}</p>
                                </div>
                            ) : (
                                <div className="cls-schedule-grid">

                                    {/* ── KUN PANELI (chap) ── */}
                                    <div className="cls-days-panel">
                                        {availDays.map((d, i) => {
                                            const color    = DAY_COLORS[i % DAY_COLORS.length];
                                            const isActive = activeDay === d.key;
                                            const count    = (schedule[d.key] || []).length;
                                            return (
                                                <button
                                                    key={d.key}
                                                    onClick={() => setActiveDay(d.key)}
                                                    className="cls-day-btn"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        padding: '12px 16px', borderRadius: 14,
                                                        background: isActive ? `${color}15` : CARD,
                                                        border: `2px solid ${isActive ? color : BORDER}`,
                                                        boxShadow: isActive ? `4px 4px 0 ${color}22` : `2px 2px 0 #0d1526`,
                                                        cursor: 'pointer', whiteSpace: 'nowrap',
                                                        textAlign: 'left', minWidth: 130,
                                                    }}
                                                >
                                                    {/* Rang dot */}
                                                    <div style={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        background: color, flexShrink: 0,
                                                        boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                                                    }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            color: isActive ? color : '#cbd5e1',
                                                            fontWeight: 700, fontSize: '0.88rem',
                                                        }}>
                                                            <span className="max-lg:inline lg:hidden">{dayShort(d)}</span>
                                                            <span className="max-lg:hidden">{dayLabel(d)}</span>
                                                        </div>
                                                    </div>
                                                    {/* Darslar soni badge */}
                                                    <div style={{
                                                        minWidth: 24, height: 24, borderRadius: 7,
                                                        background: isActive ? `${color}28` : 'rgba(255,255,255,0.05)',
                                                        border: `1px solid ${isActive ? color+'40' : BORDER}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: isActive ? color : '#475569',
                                                        fontSize: '0.72rem', fontWeight: 800,
                                                    }}>
                                                        {count}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* ── JADVAL PANEL (o'ng) ── */}
                                    <div key={activeDay} className="cls-anim" style={{
                                        background: CARD, border: `1.5px solid ${BORDER}`,
                                        borderRadius: 20, overflow: 'hidden',
                                    }}>
                                        {/* Sarlavha bant */}
                                        <div style={{
                                            background: `${activeDayColor}12`,
                                            borderBottom: `2px solid ${activeDayColor}28`,
                                            padding: '16px 24px',
                                            display: 'flex', alignItems: 'center', gap: 12,
                                        }}>
                                            <div style={{
                                                width: 12, height: 12, borderRadius: '50%',
                                                background: activeDayColor,
                                                boxShadow: `0 0 10px ${activeDayColor}90`,
                                            }} />
                                            <span style={{ color: activeDayColor, fontWeight: 800, fontSize: '1.05rem' }}>
                                                {(() => { const d = availDays.find(d => d.key === activeDay); return d ? dayLabel(d) : activeDay; })()}
                                            </span>
                                            <div style={{ marginLeft: 'auto', display:'flex', alignItems:'center', gap: 8 }}>
                                                <span style={{
                                                    background: `${activeDayColor}18`, color: activeDayColor,
                                                    fontSize: '0.75rem', fontWeight: 700,
                                                    padding: '4px 12px', borderRadius: 20,
                                                    border: `1px solid ${activeDayColor}30`,
                                                }}>
                                                    {dayLessons.length} {ui.lessons}
                                                </span>
                                            </div>
                                        </div>

                                        {dayLessons.length === 0 ? (
                                            <div style={{
                                                display:'flex', flexDirection:'column',
                                                alignItems:'center', justifyContent:'center',
                                                padding: '60px 0', color:'#334155', gap: 12,
                                            }}>
                                                <CalendarX2 size={36} strokeWidth={1.3} />
                                                <span style={{ fontSize:'0.9rem', color:'#475569' }}>{ui.noLessons}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                {dayLessons.map((lesson, i) => (
                                                    <div
                                                        key={i}
                                                        className="cls-row"
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 16,
                                                            padding: '16px 24px',
                                                            borderBottom: i < dayLessons.length - 1 ? `1px solid ${BORDER}` : 'none',
                                                        }}
                                                    >
                                                        {/* Dars № */}
                                                        <div style={{
                                                            flexShrink: 0,
                                                            width: 40, height: 40, borderRadius: 12,
                                                            background: `${activeDayColor}15`,
                                                            border: `1.5px solid ${activeDayColor}30`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: activeDayColor, fontWeight: 900, fontSize: '1rem',
                                                        }}>
                                                            {lesson.lesson_number ?? i + 1}
                                                        </div>

                                                        {/* Fan nomi + chiplar */}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{
                                                                color: '#f1f5f9', fontWeight: 700,
                                                                fontSize: '0.95rem', marginBottom: 6,
                                                            }}>
                                                                {lesson[sk] || lesson.subject_latin || lesson.subject || '—'}
                                                            </div>
                                                            <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                                                                {lesson.room && (
                                                                    <span style={{
                                                                        display:'inline-flex', alignItems:'center', gap: 4,
                                                                        background: 'rgba(255,255,255,0.05)',
                                                                        border: `1px solid ${BORDER}`,
                                                                        color: '#94a3b8', borderRadius: 8,
                                                                        padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
                                                                    }}>
                                                                        <MapPin size={11} strokeWidth={2} color="#64748b" />
                                                                        {lesson.room}
                                                                    </span>
                                                                )}
                                                                {(lesson.start_time || lesson.end_time) && (
                                                                    <span style={{
                                                                        display:'inline-flex', alignItems:'center', gap: 4,
                                                                        background: `${activeDayColor}10`,
                                                                        border: `1px solid ${activeDayColor}25`,
                                                                        color: activeDayColor, borderRadius: 8,
                                                                        padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700,
                                                                    }}>
                                                                        <Clock size={11} strokeWidth={2} />
                                                                        {lesson.start_time}{lesson.end_time ? ` – ${lesson.end_time}` : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
