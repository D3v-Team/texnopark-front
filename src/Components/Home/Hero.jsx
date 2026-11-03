import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';

const SLIDES = [
    {
        id: 1,
        bg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80',
        title_uz: 'KELAJAK TEXNOLOGIYALARI',
        title_ru: 'ТЕХНОЛОГИИ БУДУЩЕГО',
        title_en: 'FUTURE TECHNOLOGIES',
        sub_uz: 'Innovatsion talim va zamonaviy texnologiyalar markazi',
        sub_ru: 'Центр инновационного образования и современных технологий',
        sub_en: 'Center of innovative education and modern technologies',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
        title_uz: 'RAQAMLI TRANSFORMATSIYA',
        title_ru: 'ЦИФРОВАЯ ТРАНСФОРМАЦИЯ',
        title_en: 'DIGITAL TRANSFORMATION',
        sub_uz: 'Yoshlarni raqamli kelajakka tayyorlaymiz',
        sub_ru: 'Готовим молодежь к цифровому будущему',
        sub_en: 'Preparing youth for digital future',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80',
        title_uz: 'START-UP EKOTIZIMI',
        title_ru: 'ЭКОСИСТЕМА СТАРТАПОВ',
        title_en: 'START-UP ECOSYSTEM',
        sub_uz: 'Biznesingizni rivojlantirish uchun barcha imkoniyatlar',
        sub_ru: 'Все возможности для развития вашего бизнеса',
        sub_en: 'All opportunities to grow your business',
    },
    {
        id: 4,
        bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80',
        title_uz: 'INNOVATSION LABORATORIYALAR',
        title_ru: 'ИННОВАЦИОННЫЕ ЛАБОРАТОРИИ',
        title_en: 'INNOVATION LABORATORIES',
        sub_uz: 'Zamonaviy jihozlar bilan jihozlangan tadqiqot markazlari',
        sub_ru: 'Исследовательские центры с современным оборудованием',
        sub_en: 'Research centers with modern equipment',
    },
];

const STATS = [
    { value: '8+',   label: 'Laboratoriya' },
    { value: '500+', label: 'Talabalar'     },
    { value: '35+',  label: 'Yunalishlar'  },
    { value: '120+', label: 'Hamkorlar'    },
];

export default function Hero() {
    const { i18n } = useTranslation();
    const [active, setActive] = useState(0);

    const lang = (() => {
        const l = i18n.language || 'uz';
        return l.startsWith('ru') ? 'ru' : l.startsWith('en') ? 'en' : 'uz';
    })();

    return (
        <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', background: '#0a0f1c' }}>
            <style>{`
                /* ───── background slider ───── */
                .hero-swiper { position: absolute; inset: 0; }
                .hero-swiper .swiper-slide { overflow: hidden; }
                .hero-slide-img {
                    width: 100%; height: 100vh; object-fit: cover;
                    animation: hZoom 18s ease-in-out infinite alternate;
                    filter: brightness(.45);
                }
                @keyframes hZoom {
                    from { transform: scale(1);    }
                    to   { transform: scale(1.08); }
                }

                /* dark vignette overlay */
                .hero-vignette {
                    position: absolute; inset: 0;
                    background:
                        linear-gradient(to right, rgba(10,15,28,.90) 35%, rgba(10,15,28,.35) 100%),
                        linear-gradient(to top,   rgba(10,15,28,.80) 0%,  transparent 50%);
                    z-index: 1;
                }

                /* ───── content layer ───── */
                .hero-body {
                    position: relative; z-index: 2;
                    display: flex; align-items: center;
                    min-height: 100vh;
                    padding: 120px 0 100px;
                }
                .hero-inner { max-width: 780px; }

                /* badge */
                .hero-badge {
                    display: inline-flex; align-items: center; gap: .625rem;
                    padding: .5rem 1.25rem;
                    background: rgba(234,108,10,.12);
                    border: 1px solid rgba(234,108,10,.3);
                    border-radius: 50px;
                    margin-bottom: 2rem;
                    animation: fadeUp .7s ease both;
                }
                .hero-badge-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #ea6c0a;
                    box-shadow: 0 0 0 0 rgba(234,108,10,.7);
                    animation: ping 1.8s ease-in-out infinite;
                }
                @keyframes ping {
                    0%,100% { box-shadow: 0 0 0 0 rgba(234,108,10,.6); }
                    60%     { box-shadow: 0 0 0 9px rgba(234,108,10,0); }
                }
                .hero-badge span { font-size: .8rem; font-weight: 600; color: rgba(255,255,255,.85); }
                .hero-badge em   { font-size: .8rem; font-weight: 700; color: #ea6c0a; font-style: normal; }

                /* heading */
                .hero-title {
                    font-size: clamp(2.4rem, 7.5vw, 5.5rem);
                    font-weight: 900; line-height: 1.08; letter-spacing: -.025em;
                    color: #fff;
                    text-shadow: 0 4px 24px rgba(0,0,0,.5);
                    margin-bottom: 1.5rem;
                    animation: fadeUp .75s ease .1s both;
                }
                .hero-title .accent {
                    background: linear-gradient(110deg,#f97316,#ea6c0a);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* subtitle */
                .hero-sub {
                    font-size: clamp(.95rem, 1.8vw, 1.2rem);
                    line-height: 1.65; color: rgba(255,255,255,.65);
                    max-width: 560px; margin-bottom: 3rem;
                    animation: fadeUp .75s ease .2s both;
                }

                /* buttons */
                .hero-btns {
                    display: flex; flex-wrap: wrap; gap: 1rem;
                    margin-bottom: 4rem;
                    animation: fadeUp .75s ease .3s both;
                }
                .hero-btn-p {
                    display: inline-flex; align-items: center; gap: .625rem;
                    padding: .9rem 2.2rem; border-radius: 50px; border: none;
                    background: linear-gradient(135deg,#ea6c0a,#f97316);
                    color: #fff; font-size: .95rem; font-weight: 700;
                    box-shadow: 0 8px 24px rgba(234,108,10,.45);
                    cursor: pointer; position: relative; overflow: hidden;
                    transition: transform .3s, box-shadow .3s;
                }
                .hero-btn-p::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
                    transform: translateX(-100%); transition: transform .55s;
                }
                .hero-btn-p:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(234,108,10,.6); }
                .hero-btn-p:hover::before { transform: translateX(100%); }
                .hero-btn-p svg { width: 17px; height: 17px; }

                .hero-btn-s {
                    display: inline-flex; align-items: center; gap: .625rem;
                    padding: .9rem 2.2rem; border-radius: 50px;
                    background: rgba(255,255,255,.07);
                    border: 1.5px solid rgba(255,255,255,.2);
                    color: #fff; font-size: .95rem; font-weight: 600;
                    backdrop-filter: blur(8px); cursor: pointer;
                    transition: background .3s, border-color .3s, transform .3s;
                }
                .hero-btn-s:hover {
                    background: rgba(255,255,255,.12);
                    border-color: rgba(234,108,10,.5);
                    transform: translateY(-3px);
                }
                .hero-btn-s svg { width: 17px; height: 17px; }

                /* stats row */
                .hero-stats {
                    display: flex; flex-wrap: wrap; gap: 0;
                    background: rgba(15,22,35,.75);
                    border: 1px solid rgba(234,108,10,.18);
                    border-radius: 18px;
                    overflow: hidden;
                    backdrop-filter: blur(16px);
                    animation: fadeUp .75s ease .45s both;
                }
                .hero-stat {
                    flex: 1; min-width: 100px;
                    padding: 1.25rem 1.5rem;
                    border-right: 1px solid rgba(255,255,255,.06);
                    transition: background .3s;
                }
                .hero-stat:last-child { border-right: none; }
                .hero-stat:hover { background: rgba(234,108,10,.08); }
                .hero-stat-val {
                    display: block; font-size: 1.75rem; font-weight: 900; line-height: 1;
                    color: #ea6c0a;
                }
                .hero-stat-lbl {
                    display: block; font-size: .75rem; font-weight: 500; margin-top: .25rem;
                    color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .05em;
                }

                /* pagination */
                .hero-dots {
                    position: absolute; bottom: 36px; left: 50%;
                    transform: translateX(-50%); z-index: 3;
                    display: flex; gap: 10px;
                }
                .hero-dot {
                    width: 10px; height: 10px; border-radius: 50%;
                    background: rgba(255,255,255,.3);
                    border: 1.5px solid rgba(255,255,255,.15);
                    transition: all .4s ease; cursor: pointer;
                }
                .hero-dot.on {
                    width: 36px; border-radius: 5px;
                    background: linear-gradient(135deg,#ea6c0a,#f97316);
                    border-color: rgba(234,108,10,.5);
                    box-shadow: 0 0 16px rgba(234,108,10,.6);
                }

                /* vertical progress bar (right side) */
                .hero-progress {
                    position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
                    z-index: 3; display: flex; flex-direction: column; gap: 10px; align-items: center;
                }
                .hero-progress-track {
                    width: 2px; height: 60px; background: rgba(255,255,255,.12); border-radius: 2px; overflow: hidden;
                }
                .hero-progress-fill {
                    width: 100%; border-radius: 2px;
                    background: linear-gradient(to bottom, #ea6c0a, #f97316);
                    animation: progressFill 5s linear infinite;
                }
                @keyframes progressFill {
                    from { height: 0%;   }
                    to   { height: 100%; }
                }
                .hero-progress-num {
                    font-size: .7rem; font-weight: 700; color: rgba(255,255,255,.4);
                    letter-spacing: .05em;
                }

                /* shared fade-up animation */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }

                /* responsive */
                @media(max-width: 768px) {
                    .hero-body { padding: 110px 0 80px; }
                    .hero-btns { flex-direction: column; }
                    .hero-btn-p, .hero-btn-s { width: 100%; justify-content: center; }
                    .hero-progress { display: none; }
                    .hero-stat { min-width: 80px; padding: 1rem; }
                    .hero-stat-val { font-size: 1.4rem; }
                }
                @media(max-width: 480px) {
                    .hero-stats { border-radius: 14px; }
                    .hero-stat-lbl { font-size: .65rem; }
                }
            `}</style>

            {/* BG Slider */}
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={2200}
                loop
                className="hero-swiper"
                onSlideChange={s => setActive(s.realIndex)}
            >
                {SLIDES.map(s => (
                    <SwiperSlide key={s.id}>
                        <img src={s.bg} alt="" className="hero-slide-img" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Vignette */}
            <div className="hero-vignette" />

            {/* Content */}
            <div className="hero-body">
                <div className="Container">
                    <div className="hero-inner">
                      

                        {/* Title */}
                        <h1 className="hero-title" key={active}>
                            {SLIDES[active][`title_${lang}`]
                                .split(' ')
                                .map((w, i) => i === 1
                                    ? <span key={i} className="accent">{w} </span>
                                    : <span key={i}>{w} </span>
                                )
                            }
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-sub" key={`sub-${active}`}>
                            {SLIDES[active][`sub_${lang}`]}
                        </p>

                        {/* Buttons */}
                        <div className="hero-btns">
                            <button className="hero-btn-p">
                                <span>Batafsil</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                            <button className="hero-btn-s">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.38A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.44 16a2 2 0 0 1 .56.92z"/>
                                </svg>
                                <span>Aloqa</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            {STATS.map(st => (
                                <div key={st.label} className="hero-stat">
                                    <em className="hero-stat-val">{st.value}</em>
                                    <span className="hero-stat-lbl">{st.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide dots */}
            <div className="hero-dots">
                {SLIDES.map((_, i) => (
                    <div key={i} className={`hero-dot ${i === active ? 'on' : ''}`} />
                ))}
            </div>

            {/* Right progress */}
            <div className="hero-progress">
                <span className="hero-progress-num">{String(active + 1).padStart(2, '0')}</span>
                <div className="hero-progress-track" key={active}>
                    <div className="hero-progress-fill" />
                </div>
                <span className="hero-progress-num">{String(SLIDES.length).padStart(2, '0')}</span>
            </div>
        </section>
    );
}
