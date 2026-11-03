import React, { useRef } from "react";
import { useEffect as useEffectGsap } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccordionGallery from "../AccordionGallery";

gsap.registerPlugin(ScrollTrigger);

// Static news data for TEXNO PARK
const STATIC_NEWS = [
    {
        id: 1,
        title_uz: "Texno Park Innovatsion Laboratoriyalarini Ochdi",
        title_ru: "Техно Парк Открыл Инновационные Лаборатории",
        title_en: "Techno Park Opened Innovation Laboratories",
        content_uz: "Zamonaviy jihozlar bilan jihozlangan yangı laboratoriyalar talabalar uchun ochildi. Bu laboratoriyalarda AI, IoT va robotexnika yo'nalishlari bo'yicha tadqiqotlar olib boriladi.",
        content_ru: "Открылись новые лаборатории с современным оборудованием для студентов. В этих лабораториях будут проводиться исследования в области AI, IoT и робототехники.",
        content_en: "New laboratories equipped with modern equipment were opened for students. Research in AI, IoT and robotics will be conducted in these laboratories.",
        cover_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        created_at: "2024-11-01"
    },
    {
        id: 2,
        title_uz: "Start-up Konferensiyasi 2024",
        title_ru: "Конференция Стартапов 2024",
        title_en: "Start-up Conference 2024",
        content_uz: "Yillik start-up konferensiyasi Texno Parkda o'tkazildi. 50 dan ortiq loyihalar tanlovda ishtirok etdi va eng yaxshi 10 tasi tanlandi.",
        content_ru: "Ежегодная конференция стартапов прошла в Техно Парке. Более 50 проектов участвовали в конкурсе, и были отобраны 10 лучших.",
        content_en: "Annual start-up conference was held at Techno Park. More than 50 projects participated in the competition, and the best 10 were selected.",
        cover_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        created_at: "2024-10-28"
    },
    {
        id: 3,
        title_uz: "Xalqaro Hamkorlik: IT Ta'lim Dasturlari",
        title_ru: "Международное Сотрудничество: IT Образовательные Программы",
        title_en: "International Cooperation: IT Educational Programs",
        content_uz: "Xorijiy universitetlar bilan hamkorlikda yangi IT ta'lim dasturlari ishlab chiqilmoqda. Bu dasturlar xalqaro standartlarga javob beradi.",
        content_ru: "В сотрудничестве с зарубежными университетами разрабатываются новые образовательные программы по IT. Эти программы соответствуют международным стандартам.",
        content_en: "New IT educational programs are being developed in cooperation with foreign universities. These programs meet international standards.",
        cover_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        created_at: "2024-10-25"
    },
    {
        id: 4,
        title_uz: "AI va Machine Learning Bootcamp",
        title_ru: "Буткемп по AI и Machine Learning",
        title_en: "AI and Machine Learning Bootcamp",
        content_uz: "3 oylik AI va Machine Learning bo'yicha intensiv bootcamp dasturi boshlanmoqda. Kursda amaliy loyihalar ustida ish olib boriladi.",
        content_ru: "Начинается 3-месячная интенсивная программа буткемпа по AI и Machine Learning. В курсе будет проводиться работа над практическими проектами.",
        content_en: "A 3-month intensive AI and Machine Learning bootcamp program is starting. The course will work on practical projects.",
        cover_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        created_at: "2024-10-20"
    },
    {
        id: 5,
        title_uz: "Texno Park Hackathon 2024",
        title_ru: "Хакатон Техно Парк 2024",
        title_en: "Techno Park Hackathon 2024",
        content_uz: "48 soatlik hackathon tadbiri noyabr oyida o'tkaziladi. Ishtirokchilar real muammolarga innovatsion yechimlar topishadi.",
        content_ru: "48-часовой хакатон пройдет в ноябре. Участники найдут инновационные решения реальных проблем.",
        content_en: "A 48-hour hackathon event will be held in November. Participants will find innovative solutions to real problems.",
        cover_image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        created_at: "2024-10-15"
    },
    {
        id: 6,
        title_uz: "Kiberhavfsizlik Trening Markazi",
        title_ru: "Центр Обучения Кибербезопасности",
        title_en: "Cybersecurity Training Center",
        content_uz: "Yangi kiberhavfsizlik trening markazi ochildi. Mutaxassislar tayyorlash uchun maxsus dasturlar ishlab chiqilgan.",
        content_ru: "Открылся новый центр обучения кибербезопасности. Разработаны специальные программы для подготовки специалистов.",
        content_en: "A new cybersecurity training center has opened. Special programs have been developed for training specialists.",
        cover_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        created_at: "2024-10-10"
    }
];

const NewsCard = ({ item, lang }) => (
    <NavLink
        to={`/yangilik/${item.id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="block group"
    >
        <div
            className="w-full rounded-xl overflow-hidden transition-all duration-300"
            style={{
                background: 'linear-gradient(135deg, #0f1623 0%, #1a1f2e 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(234,108,10,0.3)';
                e.currentTarget.style.borderColor = 'rgba(234,108,10,0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div className="h-[180px] flex items-center justify-center relative overflow-hidden">
                <img src={item.cover_image} alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                    style={{ background: 'linear-gradient(135deg, #ea6c0a 0%, #f97316 100%)' }}>
                    Yangilik
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                </div>
                <h3 className="font-bold text-base leading-snug line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors duration-200" style={{ color: '#fff' }}>
                    {item[`title_${lang}`] || item.title_uz}
                </h3>
                <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item[`content_${lang}`] || item.content_uz}
                </p>
            </div>
        </div>
    </NavLink>
);

const News = () => {
    const { t, i18n } = useTranslation();
    const headerRef = useRef(null);
    const cardsRef  = useRef(null);
    
    const getCurrentLang = () => {
        const lang = i18n.language || 'uz';
        if (lang.includes('uz')) return 'uz';
        if (lang.includes('ru')) return 'ru';
        if (lang.includes('en')) return 'en';
        return 'uz';
    };

    const galleryItems = STATIC_NEWS.slice(0, 5).map(n => ({
        image: n.cover_image,
        label: n[`title_${getCurrentLang()}`] || n.title_uz,
        link: `/yangilik/${n.id}`,
    }));

    useEffectGsap(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 28 },
                { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
                  scrollTrigger: { trigger: headerRef.current, start: 'top 90%', toggleActions: 'play none none none' } }
            );
            gsap.fromTo(cardsRef.current?.children || [],
                { opacity: 0, y: 36 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
                  scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', toggleActions: 'play none none none' } }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <section id="news-section" style={{ background: 'linear-gradient(180deg, #0a0f1c 0%, #050a14 100%)', color: '#fff' }} className="py-20">
            <div className="Container">
                {/* header */}
                <div ref={headerRef} className="flex items-end justify-between mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(234,108,10,0.1)', border: '1px solid rgba(234,108,10,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ea6c0a' }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#ea6c0a' }}>
                                So&apos;nggi xabarlar
                            </span>
                        </div>
                        <h2 className="text-4xl font-black mb-2" style={{ color: '#fff' }}>{t('Yangiliklar')}</h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Texno Park yangiliklaridan xabardor bo'ling</p>
                    </div>
                    <NavLink
                        to="/barcha-yangiliklar"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-orange-400 transition-all px-5 py-2.5 rounded-xl group"
                        style={{ 
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.02)'
                        }}
                    >
                        {t('Koproqkorish')}
                        <svg width="12" height="12" viewBox="0 0 14 15" fill="none" className="group-hover:translate-x-1 transition-transform">
                            <path d="M1.16666 7.50002H12.8333M12.8333 7.50002L6.99999 1.66669M12.8333 7.50002L6.99999 13.3334"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </NavLink>
                </div>

                {/* AccordionGallery — interactive image accordion */}
                <div className="mb-12">
                    <AccordionGallery
                        items={galleryItems}
                        defaultIndex={2}
                        expandRatio={0.48}
                        trigger="hover"
                        accentColor="#ea6c0a"
                        overlayColor="#0a0f1c"
                        textColor="#ffffff"
                        grayscale={true}
                        showLabels={true}
                        duration={0.55}
                        ease="power3.out"
                        parallax={0.4}
                        tilt={6}
                        stagger={0.06}
                        height={400}
                        gap={10}
                        radius={16}
                        orientation="horizontal"
                    />
                </div>

                {/* Small news cards row */}
                <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STATIC_NEWS.slice(0, 3).map(item => (
                        <NewsCard key={item.id} item={item} lang={getCurrentLang()} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;

