import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import pub, { mediaUrl, useLang } from "../utils/api";
import { BookOpen, Code2, Dumbbell, Globe2, MapPin, Music2, Palette, Search, Clock, Users2 } from "lucide-react";

/* ── Ranglar — eskisi bilan bir xil, faqat dizayn uslubi o'zgargan ── */
const ORANGE = { color: '#ea6c0a', bg: '#fff7ed', border: '#fed7aa' };
const INK    = '#1f235b'; // qalin chegara / qattiq soya rangi

const CAT = {
    SPORT:      { label: 'Sport',        icon: Dumbbell, ...ORANGE },
    SCIENCE:    { label: 'Fan',          icon: BookOpen, ...ORANGE },
    ART:        { label: "San'at",       icon: Palette,  ...ORANGE },
    LANGUAGE:   { label: 'Til',          icon: Globe2,   ...ORANGE },
    TECHNOLOGY: { label: 'Texnologiya',  icon: Code2,    ...ORANGE },
    MUSIC:      { label: 'Musiqa',       icon: Music2,   ...ORANGE },
    OTHER:      { label: 'Boshqa',       icon: BookOpen, ...ORANGE },
};

// Kaskad effekti uchun — kartalar biroz "sakrab" turadi (referens rasmdagi kabi)
const STAGGER = [0, 26, 10, 34];

export default function ClubsPage() {
    const { t } = useTranslation();
    const lang  = useLang(); // 'latin' | 'cyril' | 'ru'
    const UI = {
        latin: { eyebrow: 'Qiziqishingizni tanlang', title: "To'garaklar", search: 'Qidirish...', all: 'Barchasi', empty: "To'garaklar topilmadi" },
        cyril: { eyebrow: 'Қизиқишингизни танланг', title: 'Тўгараклар', search: 'Қидириш...', all: 'Барчаси', empty: 'Тўгараклар топилмади' },
        ru: { eyebrow: 'Выберите интерес', title: 'Кружки', search: 'Поиск...', all: 'Все', empty: 'Кружки не найдены' },
    };
    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [catFilt, setCatFilt] = useState('');
    const [search,  setSearch]  = useState('');
    const ui = UI[lang] || UI.latin;
    const categoryLabels = lang === 'ru'
        ? { SPORT: 'Спорт', SCIENCE: 'Наука', ART: 'Искусство', LANGUAGE: 'Языки', TECHNOLOGY: 'Технологии', MUSIC: 'Музыка', OTHER: 'Другое' }
        : lang === 'cyril'
        ? { SPORT: 'Спорт', SCIENCE: 'Фан', ART: 'Санъат', LANGUAGE: 'Тил', TECHNOLOGY: 'Технология', MUSIC: 'Мусиқа', OTHER: 'Бошқа' }
        : { SPORT: 'Sport', SCIENCE: 'Fan', ART: "San'at", LANGUAGE: 'Til', TECHNOLOGY: 'Texnologiya', MUSIC: 'Musiqa', OTHER: 'Boshqa' };

    useEffect(() => {
        pub.get('/api/clubs/public', { params: { limit: 100 } })
            .then(res => setItems(res.data?.data || res.data?.items || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    const nk = `name_${lang}`;
    const dk = `description_${lang}`;
    const sk = `schedule_${lang}`;

    const usedCats = [...new Set(items.map(i => i.category))];

    const filtered = items.filter(i =>
        (!catFilt || i.category === catFilt) &&
        (!search || (i[nk] || i.name_latin || '').toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <style>{`
                .club-card   { transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s cubic-bezier(.2,.8,.2,1); }
                .club-card:hover { transform: translate(-5px,-5px); box-shadow: 10px 10px 0 #ea6c0a !important; }
                .club-chip   { transition: transform .2s ease, background .2s ease, color .2s ease, box-shadow .2s ease; }
                .club-chip:hover { transform: translate(-2px,-2px); }
                .club-search:focus { outline: none; }
                .club-page-surface { background: #0a0f1c !important; }
                html.dark .club-page-surface { background: #0a0f1c !important; }
                .club-page-surface h1 { color: #f8fafc !important; }
                .club-page-surface .club-search { color: #f8fafc !important; background-color: #151d32 !important; border: 1px solid #263657 !important; border-bottom: 2px solid #ea6c0a !important; border-radius: 10px; }
                .club-page-surface .club-search::placeholder { color: #94a3b8 !important; }
                html.dark body:not(:has(.admin-panel)) .club-page-surface .club-search { background-color: #151d32 !important; color: #f8fafc !important; }
                @media (max-width: 640px) {
                    .club-card-inner { flex-direction: column !important; }
                    .club-card-photo { width: 100% !important; height: 200px !important; flex-shrink: unset !important; }
                }
            `}</style>

            <section style={{ minHeight: '60vh', marginTop: '120px' }} className="club-page-surface py-12">
                <div className="Container">

                    {/* ── heading ── */}
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold mt-1" style={{ color: '#f8fafc' }}>{ui.title}</h1>
                    </div>

                    {/* ── filters ── */}
                    <div className="flex flex-wrap gap-3 mb-14 items-center">
                        <div className="relative" style={{ maxWidth: 300, flex: '1 1 220px' }}>
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2" size={16} strokeWidth={2.5} color={ORANGE.color} aria-hidden="true" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder={ui.search}
                                className="club-search w-full pl-8 pr-3 py-2 text-sm font-medium"
                                style={{ color: '#f8fafc' }} />
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <button onClick={() => setCatFilt('')}
                                className="club-chip px-4 py-2 rounded-full text-xs font-extrabold"
                                style={{
                                    background: !catFilt ? ORANGE.color : 'transparent',
                                    color: !catFilt ? '#fff' : '#94a3b8',
                                    border: `2px solid ${!catFilt ? ORANGE.color : '#334155'}`,
                                    boxShadow: !catFilt ? `3px 3px 0 #1f235b` : 'none',
                                }}>
                                {ui.all}
                            </button>
                            {usedCats.map(cat => {
                                const c = CAT[cat] || CAT.OTHER;
                                const active = catFilt === cat;
                                return (
                                    <button key={cat} onClick={() => setCatFilt(cat)}
                                        className="club-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold"
                                        style={{
                                            background: active ? ORANGE.color : 'transparent',
                                            color: active ? '#fff' : '#94a3b8',
                                            border: `2px solid ${active ? ORANGE.color : '#334155'}`,
                                            boxShadow: active ? `3px 3px 0 #1f235b` : 'none',
                                        }}>
                                        <c.icon size={13} strokeWidth={2.4} aria-hidden="true" /> {categoryLabels[cat] || categoryLabels.OTHER}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── content ── */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                border: `4px solid ${ORANGE.bg}`, borderTopColor: ORANGE.color,
                                animation: 'spin 0.8s linear infinite',
                            }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mx-auto mb-5 flex items-center justify-center" style={{
                                width: 64, height: 64, borderRadius: 18, border: `2.5px dashed #334155`,
                            }}>
                                <BookOpen size={26} strokeWidth={1.8} color="#94a3b8" aria-hidden="true" />
                            </div>
                            <p className="text-lg font-bold" style={{ color: '#94a3b8' }}>{ui.empty}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {filtered.map((item, idx) => {
                                const cat = CAT[item.category] || CAT.OTHER;
                                return (
                                    <div
                                        key={item.id || idx}
                                        className="club-card rounded-[20px] overflow-hidden"
                                        style={{
                                            background: '#151d32',
                                            border: `2px solid #1e2d4a`,
                                            boxShadow: `6px 6px 0 #0d1526`,
                                        }}
                                    >
                                        {/* ── horizontal inner ── */}
                                        <div className="club-card-inner flex" style={{ minHeight: 150 }}>

                                            {/* ── CHAP: Rasm / Icon ── */}
                                            <div
                                                className="club-card-photo relative flex-shrink-0 overflow-hidden"
                                                style={{ width: 190, background: '#0d1526' }}
                                            >
                                                {item.cover_image ? (
                                                    <img
                                                        src={mediaUrl(item.cover_image)}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        style={{ minHeight: '100%' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 150 }}>
                                                        <cat.icon size={52} strokeWidth={1.2} color={cat.color} aria-hidden="true" style={{ opacity: 0.25 }} />
                                                    </div>
                                                )}
                                                {/* gradient chap→o'ng */}
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'linear-gradient(to right, transparent 55%, #151d32 100%)',
                                                    pointerEvents: 'none',
                                                }} />
                                                {/* kategoriya stikeri */}
                                                <span
                                                    className="absolute flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                                                    style={{
                                                        left: 10, bottom: 10,
                                                        background: 'rgba(13,21,38,0.9)',
                                                        color: cat.color,
                                                        border: `1.5px solid ${cat.color}`,
                                                        backdropFilter: 'blur(4px)',
                                                    }}
                                                >
                                                    <cat.icon size={11} strokeWidth={2.4} aria-hidden="true" />
                                                    {categoryLabels[item.category] || categoryLabels.OTHER}
                                                </span>
                                            </div>

                                            {/* ── O'NG: Content ── */}
                                            <div className="flex flex-col justify-center flex-1 px-6 py-5" style={{ minWidth: 0 }}>

                                                {/* accent chiziq */}
                                                <div style={{ height: 3, width: 36, borderRadius: 99, background: cat.color, marginBottom: 10 }} />

                                                <h2 className="font-extrabold leading-tight mb-1"
                                                    style={{ color: '#f1f5f9', fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}>
                                                    {item[nk] || item.name_latin || '—'}
                                                </h2>

                                                {item[dk] && (
                                                    <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: '#94a3b8' }}>
                                                        {item[dk]}
                                                    </p>
                                                )}

                                                {/* info chips */}
                                                <div className="flex flex-wrap gap-2">
                                                    {item.supervisor_name && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(234,108,10,0.1)', color: '#cbd5e1', border: '1px solid rgba(234,108,10,0.2)' }}>
                                                            <Users2 size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{item.supervisor_name}</span>
                                                        </div>
                                                    )}
                                                    {item.age_group && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2">
                                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                                                            </svg>
                                                            <span>{item.age_group}</span>
                                                        </div>
                                                    )}
                                                    {item[sk] && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <Clock size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{item[sk]}</span>
                                                        </div>
                                                    )}
                                                    {item.location && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <MapPin size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{item.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── O'NG chegara aksent ── */}
                                            <div style={{ width: 4, flexShrink: 0, background: `linear-gradient(to bottom, ${cat.color}, transparent)`, opacity: 0.6 }} />
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