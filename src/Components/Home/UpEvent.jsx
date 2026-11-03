import React, { useRef } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BG     = '#0a0f1c';
const ACCENT = '#ea6c0a';

const monthNames = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const weekdays   = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];

// Static events for TEXNO PARK
const STATIC_EVENTS = [
    {
        id: 1,
        title_uz: "AI Bootcamp Start",
        title_ru: "Старт AI Буткемпа",
        title_en: "AI Bootcamp Start",
        location_uz: "Lab A-101",
        location_ru: "Лаб A-101",
        location_en: "Lab A-101",
        event_date: "2024-11-15",
        cover_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80"
    },
    {
        id: 2,
        title_uz: "Hackathon 2024",
        title_ru: "Хакатон 2024",
        title_en: "Hackathon 2024",
        location_uz: "Texno Park Hall",
        location_ru: "Зал Техно Парка",
        location_en: "Techno Park Hall",
        event_date: "2024-11-20",
        cover_image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80"
    },
    {
        id: 3,
        title_uz: "Blockchain Conference",
        title_ru: "Конференция Blockchain",
        title_en: "Blockchain Conference",
        location_uz: "Conference Room",
        location_ru: "Конференц-зал",
        location_en: "Conference Room",
        event_date: "2024-12-01",
        cover_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80"
    }
];

/* ── Mini Calendar ───────────────────────────────────────────── */
function MiniCalendar() {
    const today = new Date();
    const [sel, setSel] = React.useState(new Date());
    const { t } = useTranslation();
    const m = sel.getMonth(), y = sel.getFullYear();

    const dim   = (yr, mo) => new Date(yr, mo + 1, 0).getDate();
    const fdIdx = (yr, mo) => { const d = new Date(yr, mo, 1).getDay(); return d === 0 ? 6 : d - 1; };

    const days = () => {
        const total = dim(y, m), fd = fdIdx(y, m);
        const prev  = dim(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1);
        const arr   = [];
        for (let i = fd - 1; i >= 0; i--)  arr.push({ d: prev - i, cur: false });
        for (let i = 1; i <= total; i++)    arr.push({ d: i, cur: true, date: new Date(y, m, i) });
        for (let i = 1; arr.length < 42; i++) arr.push({ d: i, cur: false });
        return arr;
    };

    const isToday = dt => dt && dt.toDateString() === today.toDateString();
    const isSel   = dt => dt && dt.toDateString() === sel.toDateString();
    const prev    = () => setSel(new Date(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, 1));
    const next    = () => setSel(new Date(m === 11 ? y + 1 : y, m === 11 ? 0 : m + 1, 1));

    return (
        <div className="rounded-xl p-4"
            style={{ background: 'linear-gradient(135deg, #0f1623 0%, #1a1f2e 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
                <button onClick={prev} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-slate-500 hover:text-white">
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <p className="text-sm font-semibold text-slate-200">{monthNames[m]} {y}</p>
                <button onClick={next} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-slate-500 hover:text-white">
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </div>
            <div className="flex justify-end mb-2">
                <button onClick={() => setSel(new Date())}
                    className="text-[10px] px-2 py-0.5 rounded-full text-slate-500 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    {t('Bugun') || 'Bugun'}
                </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekdays.map(d => <div key={d} className="text-center text-[10px] text-slate-600 py-0.5">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {days().map((item, i) => (
                    <button key={i}
                        onClick={() => item.date && setSel(item.date)}
                        className={`w-7 h-7 mx-auto rounded-full text-[11px] flex items-center justify-center transition-all duration-150
                            ${!item.cur ? 'text-slate-700' : 'text-slate-400 hover:bg-white/10'}
                            ${item.date && isSel(item.date)  ? '!text-white' : ''}
                            ${item.date && isToday(item.date) && !isSel(item.date) ? 'ring-1 ring-orange-500' : ''}
                        `}
                        style={item.date && isSel(item.date) ? { background: ACCENT } : {}}>
                        {item.d}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ── Event row ───────────────────────────────────────────────── */
function EventRow({ event, lang }) {
    const d = event.event_date ? new Date(event.event_date) : null;
    const day = d && !isNaN(d) ? String(d.getDate()).padStart(2, '0') : '';
    const monthShort = d && !isNaN(d) ? monthNames[d.getMonth()]?.slice(0, 3).toUpperCase() || '' : '';

    return (
        <div className="flex items-center gap-3 rounded-xl p-3.5 transition-all duration-300 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0f1623 0%, #1a1f2e 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => { 
                e.currentTarget.style.borderColor = `${ACCENT}60`; 
                e.currentTarget.style.background = 'linear-gradient(135deg, #141d2e 0%, #1f2937 100%)'; 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(234,108,10,0.2)';
            }}
            onMouseLeave={e => { 
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; 
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f1623 0%, #1a1f2e 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}>

            {event.cover_image ? (
                <img
                    src={event.cover_image}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    style={{ border: `2px solid ${ACCENT}30` }}
                />
            ) : (
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}20, ${ACCENT}10)`, border: `2px solid ${ACCENT}40` }}>
                    <span className="text-lg font-extrabold leading-none" style={{ color: ACCENT }}>{day}</span>
                    <span className="text-[9px] font-semibold text-slate-500 mt-0.5">{monthShort}</span>
                </div>
            )}

            {/* info */}
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug line-clamp-1" style={{ color: '#fff' }}>
                    {event[`title_${lang}`] || event.title_uz}
                </p>
                <p className="text-[11px] mt-1 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {day} {monthShort}
                    {event[`location_${lang}`] && (
                        <>
                            <span className="text-slate-700">•</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {event[`location_${lang}`]}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function CustomCalendar() {
    const { t, i18n } = useTranslation();
    const sectionRef  = useRef(null);
    
    const getCurrentLang = () => {
        const lang = i18n.language || 'uz';
        if (lang.includes('uz')) return 'uz';
        if (lang.includes('ru')) return 'ru';
        if (lang.includes('en')) return 'en';
        return 'uz';
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.upevent-header',
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                  scrollTrigger: { trigger: '.upevent-header', start: 'top 90%', toggleActions: 'play none none none' } }
            );
            gsap.fromTo('.upevent-row',
                { opacity: 0, x: -24 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
                  scrollTrigger: { trigger: '.upevent-list', start: 'top 88%', toggleActions: 'play none none none' } }
            );
            gsap.fromTo('.upevent-calendar',
                { opacity: 0, x: 32 },
                { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out',
                  scrollTrigger: { trigger: '.upevent-calendar', start: 'top 88%', toggleActions: 'play none none none' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="events-section" ref={sectionRef} style={{ background: 'linear-gradient(180deg, #050a14 0%, #0a0f1c 100%)', color: '#fff' }} className="py-20">
            <div className="Container">
                <div className="upevent-header mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                        style={{ background: 'rgba(234,108,10,0.1)', border: '1px solid rgba(234,108,10,0.2)' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                            Jadval
                        </span>
                    </div>
                    <h2 className="text-4xl font-black mb-2" style={{ color: '#fff' }}>
                        Yaqinlashib Kelayotgan Tadbirlar
                    </h2>
                    <p className="text-slate-500 text-sm">Texno Park tadbirlari kalendari</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left — events list */}
                    <div className="flex-1 flex flex-col gap-3 upevent-list">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-1">
                            Kelgusi Tadbirlar
                        </p>
                        {STATIC_EVENTS.map((ev, i) => (
                            <div key={ev.id || i} className="upevent-row">
                                <EventRow event={ev} lang={getCurrentLang()} />
                            </div>
                        ))}
                    </div>

                    {/* Right — calendar */}
                    <div className="upevent-calendar flex-shrink-0 w-full lg:w-[300px]">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-3">
                            Taqvim
                        </p>
                        <MiniCalendar />
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            {[
                                { label: "Bu oyda", value: STATIC_EVENTS.length, sub: "tadbir" },
                                { label: "Jami", value: "12+", sub: "event" },
                            ].map((s, i) => (
                                <div key={i} className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #0f1623 0%, #1a1f2e 100%)', 
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}>
                                    <p className="text-2xl font-extrabold mb-1" style={{ color: ACCENT }}>{s.value}</p>
                                    <p className="text-[10px] text-slate-500">{s.label}</p>
                                    <p className="text-[9px] text-slate-700">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
