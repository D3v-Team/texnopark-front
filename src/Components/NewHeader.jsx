import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelect from './others/LanguageSelect';

const NAV_LINKS = [
    { id: 'news-section',     label: 'Yangiliklar' },
    { id: 'events-section',   label: 'Tadbirlar'   },
    { id: 'stats-section',    label: 'Statistika'  },
    { id: 'services-section', label: 'Xizmatlar'   },
    { id: 'gallery-section',  label: 'Galereya'    },
];

function scrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__univerLenis) {
        window.__univerLenis.scrollTo(el, { offset: -90 });
    } else {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
}

export default function NewHeader() {
    const [open, setOpen]       = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t }                 = useTranslation();
    const location              = useLocation();
    const isHome                = location.pathname === '/';

    /* scroll detection */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close on route change */
    useEffect(() => { setOpen(false); }, [location.pathname]);

    function handleNav(e, id) {
        if (isHome) { e.preventDefault(); scrollTo(id); }
        setOpen(false);
    }

    return (
        <>
            <style>{`
                .nh-header {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
                    transition: background .4s, box-shadow .4s, padding .3s;
                }
                .nh-header.scrolled {
                    background: rgba(10,15,28,.95);
                    backdrop-filter: blur(24px);
                    box-shadow: 0 1px 0 rgba(234,108,10,.12), 0 8px 32px rgba(0,0,0,.45);
                }
                .nh-inner {
                    display: flex; align-items: center; justify-content: space-between;
                    height: 76px; gap: 2rem;
                }

                /* ── logo ── */
                .nh-logo {
                    display: flex; align-items: center; gap: .875rem;
                    text-decoration: none; flex-shrink: 0;
                }
                .nh-logo-icon {
                    width: 46px; height: 46px; border-radius: 13px;
                    background: linear-gradient(135deg,#ea6c0a,#f97316);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 18px rgba(234,108,10,.45);
                    transition: transform .3s, box-shadow .3s;
                    flex-shrink: 0;
                }
                .nh-logo:hover .nh-logo-icon {
                    transform: scale(1.08) rotate(-4deg);
                    box-shadow: 0 6px 28px rgba(234,108,10,.65);
                }
                .nh-logo-icon svg { width: 24px; height: 24px; color: #fff; }
                .nh-logo-texts { display: flex; flex-direction: column; gap: 1px; }
                .nh-logo-main  {
                    font-size: 1.125rem; font-weight: 900; letter-spacing: .06em;
                    color: #fff; line-height: 1;
                }
                .nh-logo-main span { color: #ea6c0a; }
                .nh-logo-sub {
                    font-size: .625rem; font-weight: 600; letter-spacing: .16em;
                    color: rgba(255,255,255,.4); text-transform: uppercase;
                }

                /* ── desktop nav ── */
                .nh-nav {
                    display: none; align-items: center; gap: .25rem;
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 50px; padding: 5px;
                }
                @media(min-width:1024px){ .nh-nav { display: flex; } }

                .nh-nav-link {
                    position: relative; padding: .625rem 1.25rem;
                    font-size: .9rem; font-weight: 500;
                    color: rgba(255,255,255,.65);
                    border-radius: 50px; text-decoration: none;
                    transition: color .25s, background .25s;
                    white-space: nowrap;
                }
                .nh-nav-link::after {
                    content: ''; position: absolute; bottom: 6px; left: 50%;
                    width: 0; height: 2px; border-radius: 2px;
                    background: #ea6c0a;
                    transform: translateX(-50%);
                    transition: width .3s ease;
                }
                .nh-nav-link:hover {
                    color: #fff;
                    background: rgba(234,108,10,.1);
                }
                .nh-nav-link:hover::after { width: 60%; }

                /* ── right side ── */
                .nh-right { display: flex; align-items: center; gap: .875rem; flex-shrink: 0; }

                .nh-lang { display: none; }
                @media(min-width:640px){ .nh-lang { display: block; } }

                .nh-cta {
                    display: none; align-items: center; gap: .5rem;
                    padding: .7rem 1.6rem; border-radius: 50px;
                    background: linear-gradient(135deg,#ea6c0a,#f97316);
                    color: #fff; font-size: .9rem; font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 4px 18px rgba(234,108,10,.4);
                    transition: transform .25s, box-shadow .25s;
                    position: relative; overflow: hidden;
                }
                @media(min-width:768px){ .nh-cta { display: flex; } }
                .nh-cta::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
                    transform: translateX(-100%); transition: transform .5s;
                }
                .nh-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(234,108,10,.6); }
                .nh-cta:hover::before { transform: translateX(100%); }
                .nh-cta svg { width: 16px; height: 16px; }

                /* ── burger ── */
                .nh-burger {
                    display: flex; flex-direction: column; justify-content: center; gap: 5px;
                    width: 44px; height: 44px; padding: 0 12px;
                    background: rgba(255,255,255,.05);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 12px; cursor: pointer;
                    transition: background .25s, border-color .25s;
                }
                .nh-burger:hover { background: rgba(234,108,10,.12); border-color: rgba(234,108,10,.3); }
                .nh-burger span {
                    display: block; height: 2px; border-radius: 2px;
                    background: rgba(255,255,255,.85);
                    transition: transform .35s, opacity .35s, width .35s;
                    transform-origin: center;
                }
                .nh-burger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
                .nh-burger.open span:nth-child(2) { opacity: 0; width: 0; }
                .nh-burger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
                @media(min-width:1024px){ .nh-burger { display: none; } }

                /* ── mobile drawer ── */
                .nh-drawer {
                    position: fixed; inset: 0; z-index: 199;
                    background: rgba(10,15,28,.97);
                    backdrop-filter: blur(28px);
                    display: flex; align-items: center; justify-content: center;
                    animation: drawerIn .3s ease-out;
                }
                @keyframes drawerIn {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nh-drawer-nav {
                    display: flex; flex-direction: column; align-items: center;
                    gap: .75rem; padding: 2rem; width: 100%; max-width: 420px;
                }
                .nh-drawer-link {
                    display: block; width: 100%; padding: 1rem 1.5rem;
                    font-size: 1.2rem; font-weight: 600; text-align: center;
                    color: rgba(255,255,255,.75); text-decoration: none;
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.08);
                    border-radius: 14px;
                    transition: background .25s, color .25s, border-color .25s, transform .25s;
                    animation: slideUp .4s ease-out backwards;
                }
                .nh-drawer-link:hover {
                    background: rgba(234,108,10,.12); color: #fff;
                    border-color: rgba(234,108,10,.3); transform: translateX(4px);
                }
                .nh-drawer-cta {
                    display: block; width: 100%; padding: 1rem 1.5rem;
                    font-size: 1.1rem; font-weight: 700; text-align: center;
                    color: #fff; text-decoration: none;
                    background: linear-gradient(135deg,#ea6c0a,#f97316);
                    border-radius: 14px;
                    box-shadow: 0 8px 24px rgba(234,108,10,.4);
                    transition: transform .25s, box-shadow .25s;
                    animation: slideUp .4s ease-out .25s backwards;
                }
                .nh-drawer-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(234,108,10,.6); }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <header className={`nh-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="Container">
                    <div className="nh-inner">
                        {/* Logo */}
                        <Link to="/" className="nh-logo" onClick={() => setOpen(false)}>
                            <div className="nh-logo-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                                    <path d="M8 21h8M12 17v4"/>
                                    <path d="M7 8h10M7 12h6"/>
                                </svg>
                            </div>
                            <div className="nh-logo-texts">
                                <span className="nh-logo-main">GULISTON</span>
                                <span className="nh-logo-sub">TEXNO PARKI</span>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="nh-nav">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.id}
                                    to={`/#${link.id}`}
                                    className="nh-nav-link"
                                    onClick={e => handleNav(e, link.id)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right */}
                        <div className="nh-right">
                            <div className="nh-lang"><LanguageSelect /></div>

                            <Link
                                to="/#contact-section"
                                className="nh-cta"
                                onClick={e => handleNav(e, 'contact-section')}
                            >
                                <span>{t('boglanish') || "Bog'lanish"}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>

                            <button
                                className={`nh-burger ${open ? 'open' : ''}`}
                                onClick={() => setOpen(v => !v)}
                                aria-label="Menu"
                            >
                                <span/><span/><span/>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {open && (
                <div className="nh-drawer" onClick={() => setOpen(false)}>
                    <nav className="nh-drawer-nav" onClick={e => e.stopPropagation()}>
                        {NAV_LINKS.map((link, i) => (
                            <Link
                                key={link.id}
                                to={`/#${link.id}`}
                                className="nh-drawer-link"
                                style={{ animationDelay: `${i * 0.06}s` }}
                                onClick={e => handleNav(e, link.id)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/#contact-section"
                            className="nh-drawer-cta"
                            onClick={e => handleNav(e, 'contact-section')}
                        >
                            {t('boglanish') || "Bog'lanish"}
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}
