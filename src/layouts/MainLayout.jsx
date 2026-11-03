import { Outlet, useLocation } from "react-router-dom";
import { createContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import NewHeader from "../Components/NewHeader";
import Footer from "../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export const DataContext = createContext();

/* ─────────────────────────────────────────────────────────────
   Lenis smooth scroll — synced with GSAP ticker
───────────────────────────────────────────────────────────── */
function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({
            duration:        1.4,
            easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation:     'vertical',
            smoothWheel:     true,
            touchMultiplier: 1.8,
            infinite:        false,
        });

        window.__univerLenis = lenis;

        const ticker = time => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            delete window.__univerLenis;
            lenis.destroy();
            gsap.ticker.remove(ticker);
        };
    }, []);
}

/* ─────────────────────────────────────────────────────────────
   Page-enter fade only — do NOT kill ScrollTriggers so that
   Home page components (News, InsState, UpEvent…) can register
   their own triggers after mount.
───────────────────────────────────────────────────────────── */
function usePageEnter(mainRef) {
    const location = useLocation();

    useEffect(() => {
        gsap.fromTo(
            mainRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' }
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);
}

export default function MainLayout() {
    const mainRef = useRef(null);
    useLenis();
    usePageEnter(mainRef);

    return (
        <DataContext.Provider>
            <NewHeader />
            <main
                ref={mainRef}
                style={{ paddingTop: '76px', minHeight: '70vh' }}
            >
                <Outlet />
            </main>
            <Footer />
        </DataContext.Provider>
    );
}
