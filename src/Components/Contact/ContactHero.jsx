import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import pub, { getLang, mediaUrl } from "../../utils/api";
import { $api } from "../../utils";
import { Mail, Phone, MapPin, ArrowDown, ArrowUpRight, Navigation, CheckCircle2, AlertCircle } from "lucide-react";

const NAVY        = '#0f1623';
const NAVY_DARK   = '#0a0f1c';
const ORANGE      = '#ea6c0a';
const ORANGE_SOFT = '#ffcf9e';
const CREAM       = '#faf8f4';

// TODO: maktabingizning haqiqiy nomini shu yerga yozing
const SCHOOL_NAME = "SURXONDARYO VILOYATI UMUMTA'LIM MAKTABI";

/* ============================================================
   TextLoop — ichki komponent (React Bits'dan, shu faylga ko'chirildi)
   ============================================================ */
const TL_VIEW_W = 1200;
const TL_VIEW_H = 520;
const TL_CX = TL_VIEW_W / 2;
const TL_CY = TL_VIEW_H / 2;
const TL_EDGE_PAD = 6;

const tlBuildPath = (shape, curviness, ribbonWidth) => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, TL_CY - Math.max(0, ribbonWidth) / 2 - TL_EDGE_PAD);

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${TL_CX - r} ${TL_CY} A ${r} ${r} 0 1 1 ${TL_CX + r} ${TL_CY} A ${r} ${r} 0 1 1 ${TL_CX - r} ${TL_CY} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${TL_CX} ${TL_CY}`,
        `C ${TL_CX + r * 0.55} ${TL_CY - h} ${TL_CX + r} ${TL_CY - h} ${TL_CX + r} ${TL_CY}`,
        `C ${TL_CX + r} ${TL_CY + h} ${TL_CX + r * 0.55} ${TL_CY + h} ${TL_CX} ${TL_CY}`,
        `C ${TL_CX - r * 0.55} ${TL_CY - h} ${TL_CX - r} ${TL_CY - h} ${TL_CX - r} ${TL_CY}`,
        `C ${TL_CX - r} ${TL_CY + h} ${TL_CX - r * 0.55} ${TL_CY + h} ${TL_CX} ${TL_CY}`,
        'Z'
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${TL_CY + rise / 2} Q ${TL_CX} ${TL_CY - rise * 1.5} ${TL_VIEW_W - 120} ${TL_CY + rise / 2}`;
    }
    case 'line':
      return `M -320 ${TL_CY} L ${TL_VIEW_W + 320} ${TL_CY}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${TL_CY} Q -160 ${TL_CY - a} 0 ${TL_CY} T 320 ${TL_CY} T 640 ${TL_CY} T 960 ${TL_CY} T 1280 ${TL_CY} T ${TL_VIEW_W + 320} ${TL_CY}`;
    }
  }
};

function TextLoop({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = '#ffffff',
  ribbon = true,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  pauseOnHover = true,
  className = '',
  style = {}
}) {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const measureRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);

  const [metrics, setMetrics] = useState({ length: 0, reps: 1 });

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`;

  const d = useMemo(() => path || tlBuildPath(shape, curviness, ribbonWidth), [path, shape, curviness, ribbonWidth]);

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing]
  );

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;
      setMetrics(prev => (prev.length === length && prev.reps === reps ? prev : { length, reps }));
    };

    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return undefined;

    const apply = offset => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute('startOffset', String(offset));
      tail.setAttribute('startOffset', String(partner));
    };

    apply(0);

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || speed <= 0) return undefined;

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => apply(state.offset)
    });

    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    if (pauseOnHover && root) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener('pointerenter', pause);
        root.removeEventListener('pointerleave', resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.reps);
  const fitLength = metrics.length || undefined;

  return (
    <div ref={rootRef} className={`relative w-full overflow-hidden ${className}`.trim()} style={style}>
      <svg
        className="block w-full h-auto"
        viewBox={`0 0 ${TL_VIEW_W} ${TL_VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : 'none'}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text ref={measureRef} className="invisible pointer-events-none" style={textStyle} aria-hidden="true">
          {unit}
        </text>

        <text className="select-none" style={textStyle} fill={color} dominantBaseline="central" aria-hidden="true">
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust="spacing">
            {loopText}
          </textPath>
        </text>

        <text className="select-none" style={textStyle} fill={color} dominantBaseline="central" aria-hidden="true">
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust="spacing">
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/* ============================================================
   ContactHero — asosiy komponent
   ============================================================ */
export default function ContactHero() {
    const { t, i18n } = useTranslation();
  const contactHeading = i18n.language?.startsWith('ru')
    ? { first: 'Есть вопросы или проект?', second: 'Напишите нам!' }
    : i18n.language?.startsWith('cyrl')
    ? { first: 'Саволларингиз борми ёки лойиҳангиз борми?', second: 'Бизга ёзинг!' }
    : { first: 'Savollaringiz bormi yoki loyihangiz bormi?', second: 'Bizga yozing!' };
    const [info,    setInfo]    = useState(null);
    const [socials, setSocials] = useState([]);
    const [form,    setForm]    = useState({ full_name: '', email: '', phone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent,    setSent]    = useState(false);
    const [error,   setError]   = useState('');
    const formRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        pub.get('/api/contact/info')
            .then(res => setInfo(res.data?.data || res.data))
            .catch(() => {});
        pub.get('/api/contact/info/social-links')
            .then(res => setSocials(res.data?.data || res.data || []))
            .catch(() => {});
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.full_name.trim() || !form.phone.trim() || !form.message.trim()) {
            setError("Ism, telefon va xabar majburiy");
            return;
        }
        setSending(true); setError('');
        try {
            await $api.post('/api/contact/messages', form);
            setSent(true);
            setForm({ full_name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Xatolik yuz berdi');
        } finally { setSending(false); }
    };

    const handleCardMouseMove = e => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };

    const address = info ? getLang(info, 'address', i18n.language) : '';

    const CONTACT_PILLS = [
        { icon: Mail,  value: info?.email },
        { icon: Phone, value: info?.phone },
        { icon: MapPin, value: address },
    ].filter(row => row.value);

    const directionsUrl = info?.latitude && info?.longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${info.latitude},${info.longitude}`
        : 'https://www.google.com/maps/search/?api=1&query=Toshkent+kimyo-texnologiya+instituti+Yangiyer+filiali';

    return (
        <section className="ch-root relative" style={{ background: '#0a0f1c' }}>
            <style>{`
                @keyframes chFadeUp { from { opacity:0; transform:translateY(24px);} to {opacity:1; transform:translateY(0);} }
                @keyframes chPopIn { from { opacity:0; transform:scale(.7);} to {opacity:1; transform:scale(1);} }
                @keyframes chSpin360 { to { transform: rotate(360deg); } }
                @keyframes chBounce { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(6px);} }
                .ch-anim{opacity:0;animation:chFadeUp .65s cubic-bezier(.22,1,.36,1) forwards;}
                .ch-d1{animation-delay:.05s}.ch-d2{animation-delay:.16s}.ch-d3{animation-delay:.27s}
                .ch-d4{animation-delay:.38s}.ch-d5{animation-delay:.49s}
                .ch-pill{ opacity:0; animation: chPopIn .5s cubic-bezier(.34,1.56,.64,1) forwards; transition: background .25s ease, color .25s ease, border-color .25s ease; }
                .ch-pill:nth-child(1){animation-delay:.4s}.ch-pill:nth-child(2){animation-delay:.5s}.ch-pill:nth-child(3){animation-delay:.6s}
                .ch-pill:hover{ background:${ORANGE}; border-color:${ORANGE}; color:${NAVY_DARK} !important; }
                .ch-social:hover{ background:${ORANGE}; border-color:${ORANGE}; }
                .ch-social:hover svg{ color:${NAVY_DARK} !important; }
                .ch-badge-spin{ animation: chSpin360 14s linear infinite; transform-origin: center; }
                .ch-badge-arrow{ animation: chBounce 1.6s ease-in-out infinite; }
                .ch-field{ transition: border-color .2s ease, background .2s ease; }
                .ch-field::placeholder { color: rgba(255,255,255,0.35); }
                .ch-field:focus{ border-color:${ORANGE} !important; background: rgba(255,255,255,0.08) !important; }
                .ch-send{ transition: background .3s ease, color .3s ease, transform .2s ease; }
                .ch-send:hover{ background:${NAVY} !important; color:#fff !important; }
                .ch-send:active{ transform: scale(0.97); }
                .ch-send:hover .ch-send-arrow{ transform: translate(3px,-3px); }
                .ch-send-arrow{ transition: transform .3s ease; }
                .ch-contact-ribbon { background: ${NAVY} !important; }
                .ch-contact-ribbon svg { height: 150px !important; }
                .ch-root > .relative:last-child { background: ${NAVY} !important; }
                .ch-spotlight{ position:relative; --x:50%; --y:50%; }
                .ch-spotlight::before{
                    content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
                    background: radial-gradient(320px circle at var(--x) var(--y), ${ORANGE}14, transparent 70%);
                    opacity:0; transition: opacity .3s ease; z-index:0;
                }
                .ch-spotlight:hover::before{ opacity:1; }
                .ch-spotlight > *{ position:relative; z-index:1; }
                .ch-map-frame{ position:relative; }
                .ch-map-frame::after{
                    content:''; position:absolute; inset:10px; border-radius:24px; pointer-events:none;
                    border: 1.5px dashed ${ORANGE}66; transition: inset .3s ease;
                }
                .ch-map-frame:hover::after{ inset:6px; }
                .ch-map-img{ filter: grayscale(85%) contrast(1.05); transition: filter .5s ease, transform .5s ease; }
                .ch-map-frame:hover .ch-map-img{ filter: grayscale(0%) contrast(1); transform: scale(1.03); }
                .ch-map-tag{ transition: transform .3s ease, background .3s ease; }
                .ch-map-frame:hover .ch-map-tag{ transform: translateY(-2px); }
                .ch-directions{ transition: background .25s ease, color .25s ease, transform .2s ease; }
                .ch-directions:hover{ background:${NAVY}; color:#fff !important; transform: translateY(-2px); }
                @media (prefers-reduced-motion: reduce){
                    .ch-anim, .ch-pill{animation:none !important;opacity:1 !important;}
                    .ch-badge-spin, .ch-badge-arrow{animation:none !important;}
                }
            `}</style>

            {/* ══ HERO — flat navy block ══ */}
            <div className="relative px-6 md:px-16 pt-16 pb-24 md:pb-28 overflow-hidden"
                style={{ background: NAVY, borderBottomLeftRadius: 56, borderBottomRightRadius: 56 }}>

                <h1 className="ch-anim ch-d1 font-extrabold text-4xl md:text-6xl leading-[1.08] w-full max-w-full mb-9" style={{ color: '#fff' }}>
                  {contactHeading.first}{' '}
                  <span style={{ color: ORANGE_SOFT }}>{contactHeading.second}</span>
                </h1>

                <div className="ch-anim ch-d2 flex flex-wrap items-center gap-3 mb-4">
                    {CONTACT_PILLS.map((row, idx) => (
                        <span key={idx} className="ch-pill flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                            style={{ border: `1.5px solid ${ORANGE}88`, color: ORANGE_SOFT }}>
                            <row.icon size={15} strokeWidth={2} aria-hidden="true" />
                            {row.value}
                        </span>
                    ))}
                </div>

                {socials.length > 0 && (
                    <div className="ch-anim ch-d3 flex flex-wrap items-center gap-3">
                        {socials.map(s => (
                            <a key={s.platform} href={s.url} target="_blank" rel="noreferrer"
                                className="ch-social w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ border: `1.5px solid ${ORANGE}55` }}
                                aria-label={s.platform}
                            >
                                {s.icon_url ? (
                                    <img src={mediaUrl(s.icon_url)} alt={s.platform} className="w-4 h-4 object-contain" />
                                ) : (
                                    <span className="text-xs font-bold" style={{ color: ORANGE_SOFT }}>{s.platform?.[0]?.toUpperCase()}</span>
                                )}
                            </a>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="ch-anim ch-d4 hidden sm:flex absolute items-center justify-center"
                    style={{ right: 40, bottom: 28, width: 116, height: 116 }}
                    aria-label={t('Formagaotish') || "Forma qismiga o'tish"}
                >
                    <svg viewBox="0 0 120 120" className="ch-badge-spin absolute inset-0 w-full h-full">
                        <defs>
                            <path id="ch-badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" />
                        </defs>
                        <text fill={ORANGE_SOFT} fontSize="9.5" fontWeight="700" letterSpacing="2">
                            <textPath href="#ch-badge-circle" startOffset="0%">
                                ALOQA FORMASI • ALOQA FORMASI •
                            </textPath>
                        </text>
                    </svg>
                    <span className="ch-badge-arrow relative z-10 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: ORANGE }}>
                        <ArrowDown size={16} color={NAVY_DARK} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                </button>
            </div>

            {/* ══ FORM SECTION ══ */}
            <div ref={formRef} className="px-6 md:px-16 py-14 md:py-16 max-w-4xl mx-auto">

                {/* creative map: grayscale->color hover, floating address tag, directions button */}
                <div className="ch-anim ch-d2 ch-map-frame rounded-[32px] overflow-hidden mb-8 relative"
                    style={{ border: `1.5px solid ${NAVY}14` }}>

                    {(info?.email || address) && (
                        <div className="ch-map-tag absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                            style={{ background: NAVY, color: '#fff' }}>
                            <MapPin size={13} color={ORANGE_SOFT} aria-hidden="true" />
                            {address || 'Manzil'}
                        </div>
                    )}

                    <a href={directionsUrl} target="_blank" rel="noreferrer"
                        className="ch-directions absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold"
                        style={{ background: '#fff', color: NAVY }}>
                        <Navigation size={13} aria-hidden="true" />
                        {t('Yonalisholish') || "Yo'nalish olish"}
                    </a>

                    <div className="ch-map-img">
                        {info?.latitude && info?.longitude ? (
                            <iframe className="w-full h-[220px] md:h-[260px]"
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${info.longitude}!3d${info.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suz!2s`}
                                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        ) : (
                            <iframe className="w-full h-[220px] md:h-[260px]"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2941.5948881208537!2d68.81028791216428!3d40.260872638163164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b2190e463cfec1%3A0xb544c6812684a012!2sToshkent%20kimyo-texnologiya%20instituti%20Yangiyer%20filiali!5e1!3m2!1sru!2s!4v1740749150665!5m2!1sru!2s"
                                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        )}
                    </div>
                </div>

                {sent ? (
                    <div className="ch-anim flex items-center gap-4 p-6 rounded-[28px]" style={{ background: NAVY }}>
                        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ORANGE }}>
                            <CheckCircle2 size={22} color={NAVY_DARK} aria-hidden="true" />
                        </div>
                        <p className="font-medium text-sm text-white">
                            Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.
                        </p>
                    </div>
                ) : (
                    <div ref={cardRef} onMouseMove={handleCardMouseMove}
                        className="ch-spotlight ch-anim ch-d3 rounded-[36px] p-6 md:p-9"
                        style={{ border: `1.5px solid rgba(234,108,10,0.2)`, background: 'rgba(15,22,35,0.6)', backdropFilter: 'blur(10px)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input type="text" value={form.full_name}
                                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                                    placeholder="Ism Familiya *"
                                    className="ch-field w-full px-6 py-4 rounded-full text-sm outline-none"
                                    style={{ border: `1.5px solid rgba(255,255,255,0.12)`, color: '#f1f5f9', background: 'rgba(255,255,255,0.05)' }} />
                                <input type="email" value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="Email"
                                    className="ch-field w-full px-6 py-4 rounded-full text-sm outline-none"
                                    style={{ border: `1.5px solid rgba(255,255,255,0.12)`, color: '#f1f5f9', background: 'rgba(255,255,255,0.05)' }} />
                                <input type="tel" value={form.phone}
                                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="Telefon *"
                                    className="ch-field w-full px-6 py-4 rounded-full text-sm outline-none"
                                    style={{ border: `1.5px solid rgba(255,255,255,0.12)`, color: '#f1f5f9', background: 'rgba(255,255,255,0.05)' }} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                                <div className="flex flex-col gap-4">
                                    <textarea rows={6} value={form.message}
                                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                        placeholder="Xabaringiz *"
                                        className="ch-field w-full px-6 py-5 rounded-[28px] text-sm resize-none outline-none"
                                        style={{ border: `1.5px solid rgba(255,255,255,0.12)`, color: '#f1f5f9', background: 'rgba(255,255,255,0.05)' }} />

                                    {error && (
                                        <div className="flex items-center gap-2 text-sm" style={{ color: '#f97316' }}>
                                            <AlertCircle size={16} color={ORANGE} aria-hidden="true" />
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" disabled={sending}
                                    className="ch-send rounded-[28px] flex flex-col items-center justify-center gap-2 py-8 md:py-0 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ background: ORANGE, color: NAVY_DARK, minHeight: 140 }}
                                >
                                    {sending ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-current/40 border-t-transparent rounded-full" style={{ animation: 'chSpin360 .7s linear infinite' }} />
                                            Yuborilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUpRight size={20} className="ch-send-arrow" aria-hidden="true" />
                                            Yuborish
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* ══ SCHOOL NAME — looping ribbon, below the form ══ */}
            <div
                className="relative overflow-hidden"
                style={{ background: '#0f172a', paddingTop: 14, paddingBottom: 14 }}
            >
                {/* SVG viewBox 0 0 1200 520 — "line" shape text sits at cy=260.
                    We clip the tall SVG so only the text strip shows (~56px).       */}
                <div style={{ height: 56, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', height: 520 }}>
                        <TextLoop
                            text={SCHOOL_NAME}
                            shape="line"
                            speed={60}
                            direction="forward"
                            separator="  ✦  "
                            curviness={0}
                            fontSize={15}
                            fontWeight={800}
                            letterSpacing={4}
                            uppercase
                            color="#ffffff"
                            ribbon={false}
                            pauseOnHover
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}