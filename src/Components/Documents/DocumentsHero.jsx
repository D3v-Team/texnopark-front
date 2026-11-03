import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { Download, FileText } from "lucide-react";
import pub, { getLang, mediaUrl } from "../../utils/api";

const NAVY   = '#0f172a';
const ORANGE = '#ea6c0a';

/* ────────────────────────────────────────────────────────────────────────
 * FlowingMenu (React Bits) — inlined so this page stays self-contained.
 * See https://reactbits.dev for the original source / docs.
 * ──────────────────────────────────────────────────────────────────────── */

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#fff'
}) {
  return (
    <div className="w-full h-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <FlowingMenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  );
}

function FlowingMenuItem({ link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, isFirst }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part');
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part');
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      className="flex-1 relative overflow-hidden text-center"
      ref={itemRef}
      style={{ borderTop: isFirst ? 'none' : `1px solid ${borderColor}`, minHeight: 44 }}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer no-underline font-bold text-[2.4vh] px-6"
        href={link}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        <span className="truncate">{text}</span>
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        ref={marqueeRef}
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="h-full w-fit flex" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center flex-shrink-0" key={idx} style={{ color: marqueeTextColor }}>
              <span className="whitespace-nowrap font-normal text-[2.4vh] leading-[1] px-[1vw]">{text}</span>
              <div className="w-[120px] h-[5vh] my-[1.5em] mx-[2vw] rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: marqueeTextColor === '#fff' ? NAVY : ORANGE }}>
                <Download size={24} strokeWidth={2.5} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Documents page
 * ──────────────────────────────────────────────────────────────────────── */

const EXT_COLORS = {
  pdf: '#ef4444',
  doc: '#3b82f6', docx: '#3b82f6',
  xls: '#22c55e', xlsx: '#22c55e',
  ppt: '#f59e0b', pptx: '#f59e0b'
};

// Builds a small rounded "file type" chip as an inline SVG data URI — used
// inside the marquee since documents don't have cover images of their own.
function extBadgeDataUri(ext) {
  const label = (ext || 'DOC').toUpperCase().slice(0, 4);
  const color = EXT_COLORS[(ext || '').toLowerCase()] || ORANGE;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60'><rect width='150' height='60' rx='14' fill='${color}'/><text x='75' y='38' font-family='Arial, sans-serif' font-size='22' font-weight='700' fill='white' text-anchor='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function DocumentsHero() {
  const { i18n } = useTranslation();
  const ui = i18n.language?.startsWith('ru')
    ? { eyebrow: 'Официальные документы', title: 'Архив документов', empty: 'Документы не найдены' }
    : i18n.language?.startsWith('cyrl')
    ? { eyebrow: 'Расмий ҳужжатлар', title: 'Ҳужжатлар архиви', empty: 'Ҳужжатлар топилмади' }
    : { eyebrow: 'Rasmiy hujjatlar', title: 'Hujjatlar arxivi', empty: 'Hujjatlar topilmadi' };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pub.get('/api/documents', { params: { limit: 100, sortBy: 'created_at', sortOrder: 'desc' } })
      .then(res => setData(res.data?.data || res.data?.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(
    () =>
      data.map(item => ({
        link: mediaUrl(item.file_url) || '#',
        text: getLang(item, 'title', i18n.language) || 'Hujjat',
        image: extBadgeDataUri(item.file_url?.split('.').pop())
      })),
    [data, i18n.language]
  );

  return (
    <section className="py-12 mt-[120px] min-h-[60vh]" style={{ background: '#0a0f1c' }}>
      <div className="Container">
        <div className="mb-9">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: '#f1f5f9' }}>
            {ui.title}
          </h1>
          <div className="w-14 h-1 rounded-full mt-3" style={{ background: ORANGE }} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center w-full h-[300px]">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#64748b' }}>
            <FileText size={48} strokeWidth={1.5} className="mx-auto mb-4" aria-hidden="true" />
            <p className="text-lg">{ui.empty}</p>
          </div>
        ) : (
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              height: `${Math.max(items.length, 4) * 44}px`,
              position: 'relative',
              border: '1px solid #1e2d4a',
            }}
          >
            <FlowingMenu
              items={items}
              speed={18}
              textColor="#f1f5f9"
              bgColor="#151d32"
              marqueeBgColor={ORANGE}
              marqueeTextColor="#ffffff"
              borderColor="#1e2d4a"
            />
          </div>
        )}
      </div>
    </section>
  );
}