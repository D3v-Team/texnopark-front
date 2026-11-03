import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MiniHeader from "../Components/MiniHeader";
import pub, { mediaUrl, useLang } from "../utils/api";
import DefaultFoto from "../img/person.jpg";
import { Search, Phone, Mail, Clock, GraduationCap, Users } from "lucide-react";

/* ── Ranglar — Clubs sahifasi bilan bir xil ── */
const ORANGE = { color: '#ea6c0a', bg: '#fff7ed', border: '#fed7aa' };
const INK    = '#1f235b';

const CATEGORIES = {
    DIRECTOR:        { label: 'Direktor',             ...ORANGE },
    DEPUTY_DIRECTOR: { label: "Direktor o'rinbosari", ...ORANGE },
    TEACHER:         { label: "O'qituvchi",           ...ORANGE },
    ADMINISTRATION:  { label: 'Ma\'muriyat',          ...ORANGE },
    OTHER:           { label: 'Boshqa',               ...ORANGE },
};

const CAT_ORDER = ['DIRECTOR','DEPUTY_DIRECTOR','TEACHER','ADMINISTRATION','OTHER'];
const STAGGER = [0, 24, 8, 30];

export default function StaffPage() {
    const { i18n, t } = useTranslation();
    const lang = useLang(); // 'latin' | 'cyril' | 'ru'
    const UI = {
        latin: { eyebrow: 'Jamoamiz bilan tanishing', title: 'Xodimlar', search: "Ism bo'yicha qidirish...", all: 'Barchasi', empty: 'Xodimlar topilmadi', more: "Batafsil ma'lumot", close: 'Yopish' },
        cyril: { eyebrow: 'Жамоамиз билан танишинг', title: 'Ходимлар', search: 'Исм бўйича қидириш...', all: 'Барчаси', empty: 'Ходимлар топилмади', more: 'Батафсил маълумот', close: 'Ёпиш' },
        ru: { eyebrow: 'Познакомьтесь с нашей командой', title: 'Сотрудники', search: 'Поиск по имени...', all: 'Все', empty: 'Сотрудники не найдены', more: 'Подробнее', close: 'Закрыть' },
    };
    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [catFilt, setCatFilt] = useState('');
    const [search,  setSearch]  = useState('');
        const ui = UI[lang] || UI.latin;
        const categoryLabels = lang === 'ru'
            ? { DIRECTOR: 'Директор', DEPUTY_DIRECTOR: 'Заместитель директора', TEACHER: 'Учитель', ADMINISTRATION: 'Администрация', OTHER: 'Другое' }
            : lang === 'cyril'
            ? { DIRECTOR: 'Директор', DEPUTY_DIRECTOR: 'Директор ўринбосари', TEACHER: 'Ўқитувчи', ADMINISTRATION: 'Маъмурият', OTHER: 'Бошқа' }
            : { DIRECTOR: 'Direktor', DEPUTY_DIRECTOR: "Direktor o'rinbosari", TEACHER: "O'qituvchi", ADMINISTRATION: "Ma'muriyat", OTHER: 'Boshqa' };
    const [openId,  setOpenId]  = useState(null);

    useEffect(() => {
        pub.get('/api/staff', { params: { limit: 100, is_active: true, sortBy: 'order', sortOrder: 'asc' } })
            .then(res => setItems(res.data?.data || res.data?.items || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    const nk = `full_name_${lang}`;
    const pk = `position_${lang}`;
    const sk = `subject_${lang}`;
    const degk = `degree_${lang}`;

    const usedCats = CAT_ORDER.filter(c => items.some(i => i.category === c));

    const filtered = items.filter(i =>
        (!catFilt || i.category === catFilt) &&
        (!search || (i[nk] || i.full_name_latin || '').toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <style>{`
                .staff-card   { transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s cubic-bezier(.2,.8,.2,1); }
                .staff-card:hover { transform: translate(-5px,-5px); box-shadow: 10px 10px 0 #ea6c0a !important; }
                .staff-chip   { transition: transform .2s ease, background .2s ease, color .2s ease; }
                .staff-chip:hover { transform: translate(-2px,-2px); }
                .staff-search:focus { outline: none; }
                .staff-detail { overflow: hidden; transition: grid-template-rows .35s cubic-bezier(.2,.8,.2,1), opacity .25s ease; display: grid; }
                .staff-page-surface { background: #0a0f1c !important; }
                html.dark .staff-page-surface { background: #0a0f1c !important; }
                .staff-page-surface h1 { color: #f8fafc !important; }
                .staff-page-surface .staff-search { color: #f8fafc !important; background-color: #151d32 !important; border: 1px solid #263657 !important; border-bottom: 2px solid #ea6c0a !important; border-radius: 10px; }
                .staff-page-surface .staff-search::placeholder { color: #94a3b8 !important; }
                html.dark body:not(:has(.admin-panel)) .staff-page-surface .staff-search { background-color: #151d32 !important; color: #f8fafc !important; border-color: #263657 !important; border-bottom-color: #ea6c0a !important; }
                @media (max-width: 640px) {
                    .staff-card-inner { flex-direction: column !important; }
                    .staff-card-photo { width: 100% !important; height: 220px !important; flex-shrink: unset !important; }
                }
            `}</style>

            <MiniHeader title={ui.title} minititle={ui.eyebrow} />

            <section style={{ minHeight: '60vh', marginTop: '20px' }} className="staff-page-surface py-12">
                <div className="Container">

                    {/* ── heading ── */}
                    <div className="mb-10">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: ORANGE.color }}>
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mt-1" style={{ color: '#f8fafc' }}>{ui.title}</h1>
                    </div>

                    {/* ── filters ── */}
                    <div className="flex flex-wrap gap-3 mb-14 items-center">
                        <div className="relative" style={{ maxWidth: 300, flex: '1 1 220px' }}>
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2" size={16} strokeWidth={2.5} color={ORANGE.color} aria-hidden="true" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder={ui.search}
                                className="staff-search w-full pl-8 pr-3 py-2 text-sm font-medium"
                                style={{ color: '#f8fafc' }} />
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <button onClick={() => setCatFilt('')}
                                className="staff-chip px-4 py-2 rounded-full text-xs font-extrabold"
                                style={{
                                    background: !catFilt ? ORANGE.color : 'transparent',
                                    color: !catFilt ? '#fff' : '#94a3b8',
                                    border: `2px solid ${!catFilt ? ORANGE.color : '#334155'}`,
                                    boxShadow: !catFilt ? `3px 3px 0 #1f235b` : 'none',
                                }}>
                                {ui.all}
                            </button>
                            {usedCats.map(cat => {
                                const c = CATEGORIES[cat];
                                const active = catFilt === cat;
                                return (
                                    <button key={cat} onClick={() => setCatFilt(cat)}
                                        className="staff-chip px-4 py-2 rounded-full text-xs font-extrabold"
                                        style={{
                                            background: active ? ORANGE.color : 'transparent',
                                            color: active ? '#fff' : '#94a3b8',
                                            border: `2px solid ${active ? ORANGE.color : '#334155'}`,
                                            boxShadow: active ? `3px 3px 0 #1f235b` : 'none',
                                        }}>
                                        {categoryLabels[cat]}
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
                                animation: 'staffSpin 0.8s linear infinite',
                            }} />
                            <style>{`@keyframes staffSpin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mx-auto mb-5 flex items-center justify-center" style={{
                                width: 64, height: 64, borderRadius: 18, border: `2.5px dashed #334155`,
                            }}>
                                <Users size={26} strokeWidth={1.8} color="#94a3b8" aria-hidden="true" />
                            </div>
                            <p className="text-lg font-bold" style={{ color: '#94a3b8' }}>{ui.empty}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {filtered.map((person, idx) => {
                                const cat = CATEGORIES[person.category] || CATEGORIES.OTHER;
                                const photo = person.photo_url
                                    ? mediaUrl(person.photo_url)
                                    : person.photo
                                    ? mediaUrl(person.photo)
                                    : person.image?.[0]?.url
                                    ? mediaUrl(person.image[0].url)
                                    : DefaultFoto;
                                const id = person.id || idx;
                                const isOpen = openId === id;
                                const hasContacts = person.reception_days || person.phone || person.email || person[degk] || person.degree_latin;

                                return (
                                    <div
                                        key={id}
                                        className="staff-card rounded-[20px] overflow-hidden"
                                        style={{
                                            background: '#151d32',
                                            border: `2px solid #1e2d4a`,
                                            boxShadow: `6px 6px 0 #0d1526`,
                                            cursor: hasContacts ? 'pointer' : 'default',
                                        }}
                                        onClick={() => hasContacts && setOpenId(isOpen ? null : id)}
                                    >
                                        {/* ── horizontal inner ── */}
                                        <div className="staff-card-inner flex" style={{ minHeight: 160 }}>

                                            {/* ── CHAP: Rasm ── */}
                                            <div
                                                className="staff-card-photo relative flex-shrink-0 overflow-hidden"
                                                style={{ width: 200, background: '#0d1526' }}
                                            >
                                                <img
                                                    src={photo}
                                                    alt={person[nk] || person.full_name_latin || ''}
                                                    className="w-full h-full object-cover"
                                                    style={{ minHeight: '100%' }}
                                                    onError={e => { e.target.src = DefaultFoto; }}
                                                />
                                                {/* gradient */}
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'linear-gradient(to right, transparent 60%, #151d32 100%)',
                                                    pointerEvents: 'none',
                                                }} />
                                                {/* kategoriya stikeri */}
                                                <span
                                                    className="absolute text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                                                    style={{
                                                        left: 10, bottom: 10,
                                                        background: 'rgba(13,21,38,0.9)',
                                                        color: cat.color,
                                                        border: `1.5px solid ${cat.color}`,
                                                        backdropFilter: 'blur(4px)',
                                                    }}
                                                >
                                                    {categoryLabels[person.category] || categoryLabels.OTHER}
                                                </span>
                                            </div>

                                            {/* ── O'NG: Content ── */}
                                            <div className="flex flex-col justify-center flex-1 px-6 py-5" style={{ minWidth: 0 }}>

                                                {/* accent chiziq */}
                                                <div style={{ height: 3, width: 36, borderRadius: 99, background: cat.color, marginBottom: 10 }} />

                                                <h2 className="font-extrabold leading-tight mb-1"
                                                    style={{ color: '#f1f5f9', fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}>
                                                    {person[nk] || person.full_name_latin || '—'}
                                                </h2>
                                                <p className="text-sm font-semibold mb-3" style={{ color: cat.color }}>
                                                    {person[pk] || person.position_latin || ''}
                                                </p>

                                                {/* qator info chips */}
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {(person[sk] || person.subject_latin) && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(234,108,10,0.1)', color: '#cbd5e1', border: '1px solid rgba(234,108,10,0.2)' }}>
                                                            <GraduationCap size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{person[sk] || person.subject_latin}</span>
                                                        </div>
                                                    )}
                                                    {person.phone && (
                                                        <a href={`tel:${person.phone}`} onClick={e => e.stopPropagation()}
                                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <Phone size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{person.phone}</span>
                                                        </a>
                                                    )}
                                                    {person.email && (
                                                        <a href={`mailto:${person.email}`} onClick={e => e.stopPropagation()}
                                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <Mail size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span className="truncate max-w-[180px]">{person.email}</span>
                                                        </a>
                                                    )}
                                                    {person.reception_days && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <Clock size={13} strokeWidth={2} color={cat.color} aria-hidden="true" />
                                                            <span>{person.reception_days}</span>
                                                        </div>
                                                    )}
                                                    {(person[degk] || person.degree_latin) && (
                                                        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2">
                                                                <circle cx="12" cy="8" r="6"/>
                                                                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                                                            </svg>
                                                            <span>{person[degk] || person.degree_latin}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── O'NG chegara: rang aksenti ── */}
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