import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import pub, { formatDate, mediaUrl, useLang } from "../utils/api";

/* ────────────────────────────────────────────────────────────────────────
 * CardSwap (React Bits) — inlined so this page stays self-contained.
 * See https://reactbits.dev for the original source / docs.
 * ──────────────────────────────────────────────────────────────────────── */

const CardSwapCard = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-2xl border border-white/10 bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
  />
));
CardSwapCard.displayName = "CardSwapCard";

const cardSwapMakeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const cardSwapPlaceNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true
  });

function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children
}) {
  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => cardSwapPlaceNow(r.current, cardSwapMakeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: "+=500", duration: config.durDrop, ease: config.ease });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = cardSwapMakeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const backSlot = cardSwapMakeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, "return");
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, "return");

      tl.call(() => { order.current = [...rest, front]; });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => { tlRef.current?.pause(); clearInterval(intervalRef.current); };
      const resume = () => { tlRef.current?.play(); intervalRef.current = window.setInterval(swap, delay); };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Newspapers page
 * ──────────────────────────────────────────────────────────────────────── */

const NP_STYLES = `
@keyframes np-card-in {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes np-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.np-card {
  animation: np-card-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
  will-change: transform;
}
.np-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -18px rgba(15, 23, 42, 0.35);
}
.np-card-cover img {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.np-card:hover .np-card-cover img {
  transform: scale(1.08);
}
.np-card-overlay {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.np-card:hover .np-card-overlay {
  opacity: 1;
  transform: translateY(0);
}
.np-card-badge {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.np-card:hover .np-card-badge {
  transform: scale(1.08) rotate(-4deg);
}
.np-feature-text {
  animation: np-fade-up 0.5s ease both;
}
.np-feature-card {
  background-size: cover;
  background-position: center;
  color: #fff;
}
.np-feature-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 80%);
}
@media (prefers-reduced-motion: reduce) {
  .np-card, .np-card-cover img, .np-card-overlay, .np-card-badge, .np-feature-text {
    animation: none !important;
    transition: none !important;
  }
}
`;

function useNpStyles() {
  useEffect(() => {
    if (document.getElementById("np-styles")) return;
    const style = document.createElement("style");
    style.id = "np-styles";
    style.textContent = NP_STYLES;
    document.head.appendChild(style);
  }, []);
}

export default function NewspapersPage() {
  const { t } = useTranslation();
  const lang = useLang(); // reactive — re-renders on language change
  const ui = {
    latin: { newLabel: 'Yangi', latest: "So'nggi sonlar", description: "Gazetamizning eng so'nggi nashrlari", empty: 'Gazetalar topilmadi', download: 'Yuklab olish', paperLabel: 'MAKTAB GAZETASI', pdfLabel: 'PDF yuklab olish' },
    cyril: { newLabel: 'Янги', latest: 'Сўнгги сонлар', description: 'Газетамизнинг сўнгги нашрлари', empty: 'Газеталар топилмади', download: 'Юклаб олиш', paperLabel: 'МАКТАБ ГАЗЕТАСИ', pdfLabel: 'PDF юклаб олиш' },
    ru:    { newLabel: 'Новое', latest: 'Последние выпуски', description: 'Последние выпуски нашей газеты', empty: 'Газеты не найдены', download: 'Скачать', paperLabel: 'ШКОЛЬНАЯ ГАЗЕТА', pdfLabel: 'Скачать PDF' },
  }[lang] || { newLabel: 'Yangi', latest: "So'nggi sonlar", description: "Gazetamizning eng so'nggi nashrlari", empty: 'Gazetalar topilmadi', download: 'Yuklab olish', paperLabel: 'MAKTAB GAZETASI', pdfLabel: 'PDF yuklab olish' };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useNpStyles();

  useEffect(() => {
    pub.get('/api/newspapers', { params: { limit: 50, sortBy: 'created_at', sortOrder: 'desc' } })
      .then(res => setItems(res.data?.data || res.data?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // lang: 'latin' | 'cyril' | 'ru'  → maps to title_latin / title_cyril / title_ru
  const titleKey = `title_${lang}`;
  const titleOf = item => item[titleKey] || item.title_latin || 'Gazeta';

  const featured = useMemo(
    () => items.filter(item => item.cover_image).slice(0, 5),
    [items, lang]
  );

  return (
    <div>
      {/* ── Featured: recent issues (CardSwap) ─────────────────────── */}
      {!loading && featured.length >= 2 && (
        <section className="py-16 overflow-hidden" style={{ background: '#0f1220', marginTop: '100px' }}>
          <div className="Container">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="np-feature-text">
                <span
                  className="inline-flex items-center gap-2 font-semibold tracking-widest uppercase text-xs mb-3"
                  style={{ color: '#ea6c0a' }}
                >
                  {ui.newLabel}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">
                  {ui.latest}
                </h1>
                <p className="text-white/60 text-sm md:text-base max-w-md">
                  {ui.description} — {ui.pdfLabel}.
                </p>
              </div>

              <div className="relative" style={{ height: 460, minHeight: 460 }}>
                <CardSwap
                  width={260}
                  height={320}
                  cardDistance={44}
                  verticalDistance={54}
                  delay={4000}
                  pauseOnHover
                  easing="elastic"
                  onCardClick={idx => {
                    const item = featured[idx];
                    if (item?.file_url) window.open(mediaUrl(item.file_url), '_blank', 'noreferrer');
                  }}
                >
                  {featured.map((item, idx) => (
                    <CardSwapCard
                      key={item.id || idx}
                      customClass="np-feature-card cursor-pointer"
                      style={{ backgroundImage: `url(${mediaUrl(item.cover_image)})` }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ zIndex: 1 }}>
                        {item.issue_number && (
                          <span
                            className="inline-block text-white text-[11px] font-bold px-2 py-0.5 rounded-full mb-2"
                            style={{ background: '#ea6c0a' }}
                          >
                            №{item.issue_number}
                          </span>
                        )}
                        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
                          {titleOf(item)}
                        </h3>
                        <p className="text-white/50 text-xs mt-1">{formatDate(item.created_at)}</p>
                      </div>
                    </CardSwapCard>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Archive grid ─────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#0a0f1c', minHeight: '60vh', marginTop: loading || featured.length < 2 ? '100px' : 0 }}>
        <div className="Container">
          <div className="mb-12">
          
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#f1f5f9' }}>
              {ui.latest}
            </h2>
            <div className="w-14 h-1 rounded-full mt-3" style={{ background: '#ea6c0a' }} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#64748b' }}>
              <div className="text-5xl mb-4">📰</div>
              <p className="text-lg">{ui.empty}</p>
            </div>
          ) : (
            <>
              <style>{`
                /* Kitob ochilgan effekt */
                .np-book { perspective: 1200px; }
                .np-book-inner {
                  display: flex;
                  transform-style: preserve-3d;
                  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
                  border-radius: 2px 8px 8px 2px;
                  position: relative;
                }
                /* Umurtqa pog'ona — kitob o'rtasidagi qo'shilish joyi */
                .np-book-inner::before {
                  content: '';
                  position: absolute;
                  top: 0; bottom: 0;
                  left: 50%;
                  width: 6px;
                  transform: translateX(-50%);
                  background: linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.45));
                  z-index: 10;
                  pointer-events: none;
                }
                /* Chap sahifa (rasm) — biroz chapga qiyshiq */
                .np-book-left {
                  flex: 1;
                  transform-origin: right center;
                  transform: rotateY(8deg);
                  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
                  border-radius: 2px 0 0 2px;
                  overflow: hidden;
                  box-shadow: -4px 0 12px rgba(0,0,0,0.4);
                }
                /* O'ng sahifa (content) — biroz o'ngga qiyshiq */
                .np-book-right {
                  flex: 1;
                  transform-origin: left center;
                  transform: rotateY(-8deg);
                  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
                  border-radius: 0 8px 8px 0;
                  overflow: hidden;
                  box-shadow: 4px 0 12px rgba(0,0,0,0.3);
                }
                /* Hover: kitob yassiladi (ochilgan holat) */
                .np-book:hover .np-book-left  { transform: rotateY(2deg); }
                .np-book:hover .np-book-right { transform: rotateY(-2deg); }
                .np-book:hover .np-book-inner {
                  transform: translateY(-6px) scale(1.02);
                }
                /* Umumiy card animatsiya */
                .np-book {
                  animation: np-book-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
                }
                @keyframes np-book-in {
                  from { opacity: 0; transform: translateY(16px) scale(0.96); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                /* Soya */
                .np-book-shadow {
                  position: absolute;
                  bottom: -10px; left: 8%; right: 8%;
                  height: 18px;
                  background: rgba(0,0,0,0.5);
                  filter: blur(12px);
                  border-radius: 50%;
                  z-index: 0;
                  transition: all 0.5s ease;
                }
                .np-book:hover .np-book-shadow {
                  bottom: -16px;
                  filter: blur(18px);
                  opacity: 0.7;
                }
                /* PDF yuklab olish overlay */
                .np-dl-overlay {
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }
                .np-book:hover .np-dl-overlay { opacity: 1; }
              `}</style>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {items.map((item, idx) => (
                  <a
                    key={item.id || idx}
                    href={item.file_url ? mediaUrl(item.file_url) : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="np-book block cursor-pointer"
                    style={{
                      textDecoration: 'none',
                      position: 'relative',
                      animationDelay: `${Math.min(idx, 10) * 60}ms`,
                    }}
                  >
                    {/* Soya */}
                    <div className="np-book-shadow" />

                    {/* Kitob asosiy qism */}
                    <div className="np-book-inner" style={{
                      height: 280,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    }}>

                      {/* ── CHAP sahifa: Muqova rasm ── */}
                      <div className="np-book-left" style={{ background: '#0d1526', position: 'relative' }}>
                        {item.cover_image ? (
                          <img
                            src={mediaUrl(item.cover_image)}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: 'linear-gradient(135deg, #0d1526 0%, #1a2744 100%)',
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span style={{ color: '#334155', fontSize: '0.7rem', fontWeight: 700 }}>PDF</span>
                          </div>
                        )}
                        {/* Rasm ustida yengil gradient */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)',
                          pointerEvents: 'none',
                        }} />
                        {/* Son raqami */}
                        {item.issue_number && (
                          <div style={{
                            position: 'absolute', top: 10, left: 10,
                            background: '#ea6c0a', color: '#fff',
                            fontSize: '0.65rem', fontWeight: 800,
                            padding: '2px 7px', borderRadius: 3,
                            letterSpacing: '0.05em',
                          }}>
                            №{item.issue_number}
                          </div>
                        )}
                        {/* Yuklab olish overlay */}
                        <div className="np-dl-overlay" style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(234,108,10,0.18)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            background: '#ea6c0a', borderRadius: '50%',
                            width: 40, height: 40,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(234,108,10,0.5)',
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* ── O'NG sahifa: Content ── */}
                      <div className="np-book-right" style={{
                        background: '#f5f0e8',
                        position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        padding: '14px 12px',
                      }}>
                        {/* Gazeta sarlavha qismi — tepada */}
                        <div style={{
                          borderBottom: '2px solid #1a1a2e',
                          paddingBottom: 6, marginBottom: 8,
                        }}>
                          <div style={{
                            fontSize: '0.5rem', fontWeight: 900,
                            color: '#1a1a2e', textTransform: 'uppercase',
                            letterSpacing: '0.15em', marginBottom: 2,
                          }}>
                            {ui.paperLabel}
                          </div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ width: '60%', height: 1, background: '#1a1a2e', opacity: 0.3 }} />
                            <div style={{ width: '30%', height: 1, background: '#1a1a2e', opacity: 0.3 }} />
                          </div>
                        </div>

                        {/* Asosiy sarlavha */}
                        <h3 style={{
                          color: '#1a1a2e', fontWeight: 900,
                          fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                          lineHeight: 1.3, marginBottom: 8,
                          fontFamily: 'Georgia, serif',
                        }}>
                          {titleOf(item)}
                        </h3>

                        {/* Dekorativ chiziqlar — gazeta ustunlari imitatsiyasi */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                          {[100, 90, 85, 95, 70, 88, 60].map((w, i) => (
                            <div key={i} style={{
                              height: 3, borderRadius: 2,
                              width: `${w}%`,
                              background: i === 0
                                ? 'rgba(26,26,46,0.25)'
                                : `rgba(26,26,46,${0.08 + i * 0.02})`,
                            }} />
                          ))}
                        </div>

                        {/* Pastki info — sana va orange aksent */}
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{
                            height: 2, background: '#ea6c0a',
                            marginBottom: 6, borderRadius: 1,
                          }} />
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <span style={{
                              color: '#4a4a6a', fontSize: '0.58rem', fontWeight: 600,
                            }}>
                              {formatDate(item.created_at)}
                            </span>
                            {item.issue_number && (
                              <span style={{
                                color: '#ea6c0a', fontSize: '0.58rem', fontWeight: 800,
                              }}>
                                №{item.issue_number}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sahifa raqami — pastki markaz */}
                        <div style={{
                          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                          color: 'rgba(26,26,46,0.25)', fontSize: '0.55rem', fontWeight: 700,
                        }}>
                          — {idx + 1} —
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}