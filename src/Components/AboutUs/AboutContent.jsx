import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, FlaskConical, Palette, Globe2, BookOpen, Dumbbell, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAVY   = '#0f1623';
const ORANGE = '#ea6c0a';

gsap.registerPlugin(ScrollTrigger);

const VALUE_ICONS = [Sparkles, ShieldCheck, Rocket];

/* ── Fake multilingual data ── */
const DATA = {
    latin: {
        label:    "Maktabimiz haqida",
        title:    "Biz haqimizda",
        text:     `Maktabimiz Surxondaryo viloyatida joylashgan bo'lib, farzandlarimizga
sifatli ta'lim berib kelmoqda. Bugungi kunda yuzlab o'quvchi va malakali
o'qituvchi jamoamizda faoliyat yuritmoqda. Maqsadimiz — har bir bolaga zamonaviy bilim,
ma'naviy tarbiya va kelajakka ishonch berish.`,
        values:   ["Sifat", "Tarbiya", "Kelajak"],
        quote:    "Biz sifat ustidan murosaga bormaymiz, chunki har bir bolaning kelajagi shu yerdan boshlanadi.",
        panelLabel: "Nega biz?",
        panelText:  "Zamonaviy dastur, kuchli ustozlar va g'amxo'r muhit — bularning barchasi bitta maqsadga xizmat qiladi.",
        bigWords: ["TA'LIM", "KELAJAK"],
        builtLabel: "Har bir tafsilotda",
        builtTitle: "E'tibor bilan qurilgan",
        stats: [
            { value: "500+", label: "Faol o'quvchi" },
            { value: "50+",  label: "Malakali o'qituvchi" },
            { value: "20+",  label: "To'garak va seksiya" },
            { value: "98%",  label: "Bitiruvchilar muvaffaqiyati" },
        ],
        wordmark: "TA'LIM \u2726 KELAJAK \u2726 ISHONCH \u2726",
        features: [
            { icon: Trophy,       title: "Olimpiada g'oliblari",     text: "Har yili viloyat va respublika olimpiadalarida o'quvchilarimiz yuqori o'rinlarni egallaydi." },
            { icon: FlaskConical, title: "Zamonaviy laboratoriyalar", text: "Fizika, kimyo va biologiya fanlaridan to'liq jihozlangan zamonaviy laboratoriya xonalari." },
            { icon: Palette,      title: "To'garaklar va seksiyalar", text: "20 dan ortiq to'garak: musiqa, rasm, robototexnika, sport va ko'plab qiziqarli mashg'ulotlar." },
            { icon: Globe2,       title: "Onlayn xizmatlar",          text: "Ariza topshirish, hujjatlar yuklab olish va direktor qabulxonasiga murojaat — to'liq onlayn." },
            { icon: BookOpen,     title: "Zamonaviy kutubxona",       text: "10 000+ kitob, elektron resurslar va o'qish zali bilan boyitilgan maktab kutubxonasi." },
            { icon: Dumbbell,     title: "Sport majmuasi",            text: "Futbol maydoni, sport zali va suzish havzasi — sog'lom avlod uchun keng imkoniyatlar." },
        ],
    },
    cyril: {
        label:    "Мактабимиз ҳақида",
        title:    "Биз ҳақимизда",
        text:     `Мактабимиз Сурхондарё вилоятида жойлашган бўлиб, фарзандларимизга
сифатли таълим бериб келмоқда. Бугунги кунда юзлаб ўқувчи ва малакали
ўқитувчи жамоамизда фаолият юритмоқда. Мақсадимиз — ҳар бир болага замонавий билим,
маънавий тарбия ва келажакка ишонч бериш.`,
        values:   ["Сифат", "Тарбия", "Келажак"],
        quote:    "Биз сифат устидан муросага бормаймиз, чунки ҳар бир боланинг келажаги шу ердан бошланади.",
        panelLabel: "Нега биз?",
        panelText:  "Замонавий дастур, кучли устозлар ва ғамхўр муҳит — буларнинг барчаси битта мақсадга хизмат қилади.",
        bigWords: ["ТАЪЛИМ", "КЕЛАЖАК"],
        builtLabel: "Ҳар бир тафсилотда",
        builtTitle: "Эътибор билан қурилган",
        stats: [
            { value: "500+", label: "Фаол ўқувчи" },
            { value: "50+",  label: "Малакали ўқитувчи" },
            { value: "20+",  label: "Тўгарак ва секция" },
            { value: "98%",  label: "Битирувчилар муваффақияти" },
        ],
        wordmark: "ТАЪЛИМ \u2726 КЕЛАЖАК \u2726 ИШОНЧ \u2726",
        features: [
            { icon: Trophy,       title: "Олимпиада ғолиблари",       text: "Ҳар йили вилоят ва республика олимпиадаларида ўқувчиларимиз юқори ўринларни эгаллайди." },
            { icon: FlaskConical, title: "Замонавий лабораториялар",   text: "Физика, кимё ва биология фанларидан тўлиқ жиҳозланган замонавий лаборатория хоналари." },
            { icon: Palette,      title: "Тўгараклар ва секциялар",   text: "20 дан ортиқ тўгарак: мусиқа, расм, робототехника, спорт ва кўплаб қизиқарли машғулотлар." },
            { icon: Globe2,       title: "Онлайн хизматлар",          text: "Ариза топшириш, ҳужжатлар юклаб олиш ва директор қабулхонасига мурожаат — тўлиқ онлайн." },
            { icon: BookOpen,     title: "Замонавий кутубхона",       text: "10 000+ китоб, электрон ресурслар ва ўқиш зали билан бойитилган мактаб кутубхонаси." },
            { icon: Dumbbell,     title: "Спорт мажмуаси",            text: "Футбол майдони, спорт зали ва сузиш ҳавзаси — соғлом авлод учун кенг имкониятлар." },
        ],
    },
    ru: {
        label:    "О нашей школе",
        title:    "О нас",
        text:     `Наша школа расположена в Сурхандарьинской области и обеспечивает детей
качественным образованием. Сегодня в нашем коллективе работают сотни учеников
и высококвалифицированных учителей. Наша цель — дать каждому ребёнку современные знания,
нравственное воспитание и уверенность в будущем.`,
        values:   ["Качество", "Воспитание", "Будущее"],
        quote:    "Мы не идём на компромисс в качестве, ведь будущее каждого ребёнка начинается именно здесь.",
        panelLabel: "Почему мы?",
        panelText:  "Современная программа, сильные учителя и заботливая среда — всё это служит одной цели.",
        bigWords: ["ЗНАНИЯ", "БУДУЩЕЕ"],
        builtLabel: "В каждой детали",
        builtTitle: "Построено с вниманием",
        stats: [
            { value: "500+", label: "Активных учеников" },
            { value: "50+",  label: "Квалифицированных учителей" },
            { value: "20+",  label: "Кружков и секций" },
            { value: "98%",  label: "Успеваемость выпускников" },
        ],
        wordmark: "ЗНАНИЯ \u2726 БУДУЩЕЕ \u2726 ДОВЕРИЕ \u2726",
        features: [
            { icon: Trophy,       title: "Победители олимпиад",       text: "Ежегодно наши ученики занимают призовые места на областных и республиканских олимпиадах." },
            { icon: FlaskConical, title: "Современные лаборатории",   text: "Полностью оснащённые лаборатории по физике, химии и биологии." },
            { icon: Palette,      title: "Кружки и секции",           text: "Более 20 кружков: музыка, рисование, робототехника, спорт и многое другое." },
            { icon: Globe2,       title: "Онлайн-услуги",             text: "Подача заявлений, скачивание документов и обращение к директору — полностью онлайн." },
            { icon: BookOpen,     title: "Современная библиотека",     text: "Более 10 000 книг, электронные ресурсы и читальный зал." },
            { icon: Dumbbell,     title: "Спортивный комплекс",       text: "Футбольное поле, спортзал и бассейн — широкие возможности для здорового поколения." },
        ],
    },
};

function normalizeLang(lang) {
    const code = (lang || 'uz').split('-')[0].toLowerCase();
    if (code === 'ru') return 'ru';
    if (['cyrl', 'kk'].includes(code)) return 'cyril';
    return 'latin';
}

/* fixed mosaic opacities so SSR/CSR never mismatch */
const MOSAIC = [0.9, 0.15, 0.4, 0.15, 1, 0.15, 0.4, 0.9, 0.15, 0.4, 0.15, 0.9];

export default function AboutContent({ compact = false }) {
    const { i18n } = useTranslation();
    const key = normalizeLang(i18n.language);
    const d   = DATA[key];

    const sectionRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const context = gsap.context(() => {
            gsap.utils.toArray('.about-reveal', sectionRef.current).forEach(element => {
                gsap.fromTo(element,
                    { autoAlpha: 0, y: 24 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => context.revert();
    }, []);

    // parallax offsets derived from section's own position, so it's subtle wherever the section sits
    const sectionTop = sectionRef.current?.offsetTop || 0;
    const relative = scrollY - sectionTop;
    const slow = relative * 0.06;
    const fast = relative * 0.14;

    return (
        <section ref={sectionRef} className={`aboutContent relative overflow-hidden py-12 ${compact ? 'mt-0' : 'mt-[100px]'}`} style={{ background: NAVY }}>
            {/* parallax glow layers — no animation, just scroll-driven transform */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl"
                style={{ background: 'rgba(234,108,10,0.14)', transform: `translateY(${slow}px)` }} />
            <div className="pointer-events-none absolute top-[55%] -left-28 w-[360px] h-[360px] rounded-full blur-3xl"
                style={{ background: 'rgba(234,108,10,0.10)', transform: `translateY(${fast * -1}px)` }} />
            <div className="pointer-events-none absolute bottom-0 right-1/3 w-[280px] h-[280px] rounded-full blur-3xl"
                style={{ background: 'rgba(255,255,255,0.05)', transform: `translateY(${slow * 0.6}px)` }} />

            <div className="Container relative">

                {/* ── Intro ── */}
                <div className="max-w-3xl mb-12 about-reveal">
                    <span className="inline-flex items-center gap-2 font-semibold tracking-widest uppercase text-xs mb-3"
                        style={{ color: ORANGE }}>
                        <span aria-hidden="true"></span>
               
                    </span>
                    {compact
                        ? <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-white">{d.title}</h2>
                        : <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-white">{d.title}</h1>}
                    <div className="w-14 h-1 rounded-full mb-6" style={{ background: ORANGE }} />
                    <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {d.text}
                    </p>
                </div>

                {/* ── BENTO row 1 ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

                    {/* quote panel */}
                    <div className="about-reveal lg:col-span-5 rounded-[32px] p-8 flex flex-col justify-between"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minHeight: 320 }}>
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4"
                                style={{ color: '#ffcf9e' }}>
                                <span aria-hidden="true">&#9670;</span> {d.panelLabel}
                            </span>
                            <p className="text-xl md:text-2xl font-bold leading-snug text-white">
                                {d.quote}
                            </p>
                        </div>
                        <div className="flex items-center gap-5 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                            {d.values.map((v, idx) => {
                                const Icon = VALUE_ICONS[idx % VALUE_ICONS.length];
                                return (
                                    <span key={idx} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        <Icon size={15} color={ORANGE} strokeWidth={2} aria-hidden="true" />
                                        {v}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* orange panel, oversized overlapping text */}
                    <div className="about-reveal lg:col-span-4 rounded-[32px] p-8 relative overflow-hidden flex flex-col"
                        style={{ background: ORANGE, minHeight: 320 }}>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3"
                            style={{ color: NAVY }}>
                            <span aria-hidden="true">&#9670;</span> {d.panelLabel === "Nega biz?" ? "E'tiqodimiz" : d.panelLabel}
                        </span>
                        <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: 'rgba(31,35,91,0.75)' }}>
                            {d.panelText}
                        </p>
                        <div className="mt-auto relative" style={{ marginBottom: -6 }}>
                            <span className="block font-extrabold uppercase leading-[0.85] select-none"
                                style={{ fontSize: 'clamp(2.2rem, 8vw, 3.4rem)', color: NAVY }}>
                                {d.bigWords[0]}
                            </span>
                            <span className="block font-extrabold uppercase leading-[0.85] select-none"
                                style={{ fontSize: 'clamp(2.2rem, 8vw, 3.4rem)', color: 'rgba(31,35,91,0.35)' }}>
                                {d.bigWords[1]}
                            </span>
                        </div>
                    </div>

                    {/* mosaic panel */}
                    <div className="about-reveal lg:col-span-3 rounded-[32px] p-8 flex flex-col justify-between"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minHeight: 320 }}>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {MOSAIC.map((op, idx) => (
                                <div key={idx} className="w-full aspect-square rounded-lg"
                                    style={{ background: idx % 5 === 0 ? ORANGE : '#ffffff', opacity: idx % 5 === 0 ? op : op * 0.4 }} />
                            ))}
                        </div>
                        <div>
                            <span className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: ORANGE }}>
                                {d.builtLabel}
                            </span>
                            <p className="font-bold text-lg leading-snug text-white">
                                {d.builtTitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── STATS row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {d.stats.map((s, idx) => (
                        <div key={idx} className="about-reveal rounded-[24px] p-6"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="flex items-center gap-1 mb-4" aria-hidden="true">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: ORANGE }} />
                                ))}
                            </div>
                            <div className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
                                {s.value}
                            </div>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Features bento ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {d.features.map((f, idx) => {
                        const featured = idx === 0;
                        return (
                            <div
                                key={idx}
                                className={`about-reveal relative rounded-3xl p-7 ${featured ? 'lg:col-span-2' : ''}`}
                                style={{
                                    background: featured ? ORANGE : 'rgba(255,255,255,0.06)',
                                    border: featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                                    style={{ background: featured ? 'rgba(31,35,91,0.15)' : 'rgba(234,108,10,0.16)' }}>
                                    <f.icon size={26} strokeWidth={1.8} color={featured ? NAVY : ORANGE} aria-hidden="true" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 leading-snug" style={{ color: featured ? NAVY : '#fff' }}>
                                    {f.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: featured ? 'rgba(31,35,91,0.75)' : 'rgba(255,255,255,0.6)' }}>
                                    {f.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* oversized bleeding wordmark banner */}
            <div className="mt-14 py-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="whitespace-nowrap font-extrabold uppercase select-none"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', color: 'rgba(255,255,255,0.9)', letterSpacing: 2, transform: `translateX(${-(relative * 0.05)}px)` }}>
                    {`${d.wordmark} ${d.wordmark} ${d.wordmark}`}
                </div>
            </div>
        </section>
    );
}