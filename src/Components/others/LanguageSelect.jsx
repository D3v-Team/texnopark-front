import { useTranslation } from "react-i18next";

const UZ_FLAG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 36 27">
        <rect width="36" height="9" fill="#0099b5"/>
        <rect y="9" width="36" height="9" fill="#fff"/>
        <rect y="18" width="36" height="9" fill="#1eb53a"/>
        <rect y="8" width="36" height="1.5" fill="#ce1126"/>
        <rect y="17.5" width="36" height="1.5" fill="#ce1126"/>
        <circle cx="6" cy="4.5" r="3" fill="#fff"/>
        <circle cx="7.2" cy="4.5" r="2.4" fill="#0099b5"/>
    </svg>
);

const RU_FLAG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 36 27">
        <rect width="36" height="9" fill="#fff"/>
        <rect y="9" width="36" height="9" fill="#0039a6"/>
        <rect y="18" width="36" height="9" fill="#d52b1e"/>
    </svg>
);

const LANGS = [
    { code: "uz",   label: "UZ",  name: "O‘zbekcha", flag: UZ_FLAG },
    { code: "cyrl", label: "КИР", name: "Ўзбекча",   flag: UZ_FLAG },
    { code: "ru",   label: "РУС", name: "Русский",   flag: RU_FLAG },
];

export default function LanguageSelect() {
    const { i18n } = useTranslation();

    const raw = (i18n.language || "uz").split("-")[0];
    const current = raw === "kk" ? "cyrl" : (["uz","cyrl","ru"].includes(raw) ? raw : "uz");

    const change = async (code) => {
        await i18n.changeLanguage(code);
        localStorage.setItem('i18nextLng', code);
    };

    return (
        <div
            role="group"
            aria-label="Tilni tanlang"
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/50 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
            <span className="hidden items-center px-2 text-slate-500 sm:flex" aria-hidden="true">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="7.25" />
                    <path d="M2.9 10h14.2M10 2.75c1.8 1.98 2.7 4.4 2.7 7.25S11.8 15.27 10 17.25C8.2 15.27 7.3 12.85 7.3 10s.9-5.27 2.7-7.25Z" />
                </svg>
            </span>
            {LANGS.map(lang => {
                const isActive = current === lang.code;
                return (
                    <button
                        key={lang.code}
                        type="button"
                        onClick={() => change(lang.code)}
                        title={lang.name}
                        aria-label={lang.name}
                        aria-pressed={isActive}
                        className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-bold tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 ${
                            isActive
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-950/40'
                                : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'
                        }`}
                    >
                        {lang.flag}
                        {lang.label}
                    </button>
                );
            })}
        </div>
    );
}
