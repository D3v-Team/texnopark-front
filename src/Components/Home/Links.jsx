import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import DriftWall from "../DriftWall";

// Static gallery data for TEXNO PARK
const STATIC_GALLERY = [
    { image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", title: "Team Workshop" },
    { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80", title: "Collaboration" },
    { image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80", title: "Innovation Hub" },
    { image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80", title: "Startup Meeting" },
    { image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80", title: "Development" },
    { image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80", title: "Technology" },
    { image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", title: "Coding Session" },
    { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80", title: "Presentation" },
    { image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80", title: "Office Space" },
    { image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80", title: "Brainstorming" },
    { image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80", title: "Tech Setup" },
    { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80", title: "Modern Office" },
    { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80", title: "Team Building" },
    { image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80", title: "Working Together" },
    { image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80", title: "Creative Space" },
    { image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80", title: "Digital Workspace" },
    { image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80", title: "Innovation Lab" },
    { image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80", title: "Project Discussion" },
    { image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80", title: "Development Work" },
    { image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80", title: "Team Collaboration" },
    { image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80", title: "Work Session" },
    { image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", title: "Group Project" },
    { image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80", title: "Tech Conference" },
    { image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80", title: "Workspace Design" },
];

export default function GallerySection() {
    const { t } = useTranslation();

    return (
        <section id="gallery-section" style={{ background: 'linear-gradient(180deg, #0a0f1c 0%, #050a14 100%)', color: '#fff' }} className="py-20">
            <div className="Container">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(234,108,10,0.1)', border: '1px solid rgba(234,108,10,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ea6c0a' }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#ea6c0a' }}>
                                Media zona
                            </span>
                        </div>
                        <h2 className="text-4xl font-black mb-2" style={{ color: '#fff' }}>
                            {t('Fotogalereya')}
                        </h2>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Texno Park hayotidan lavhalar</p>
                    </div>
                    <NavLink
                        to="/fotogalereya"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-orange-400
                            transition-all px-5 py-2.5 rounded-xl group"
                        style={{ 
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.02)'
                        }}
                    >
                        Barchasini ko&apos;rish
                        <svg width="12" height="12" viewBox="0 0 14 15" fill="none" className="group-hover:translate-x-1 transition-transform">
                            <path d="M1.16666 7.50002H12.8333M12.8333 7.50002L6.99999 1.66669M12.8333 7.50002L6.99999 13.3334"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </NavLink>
                </div>

                <div style={{ 
                    height: 580, 
                    borderRadius: 16, 
                    overflow: 'hidden', 
                    marginLeft: 'calc(-50vw + 50%)', 
                    marginRight: 'calc(-50vw + 50%)', 
                    width: '100vw',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <DriftWall
                        items={STATIC_GALLERY}
                        columns={6}
                        tileWidth={220}
                        tileHeight={145}
                        gap={12}
                        radius={10}
                        tilt={14}
                        turn={-12}
                        perspective={1200}
                        depth={100}
                        speed={38}
                        direction="up"
                        variance={0.4}
                        parallax={0.55}
                        lift={60}
                        fade={0.5}
                        dim={0.6}
                        grayscale={true}
                        overlayColor="#0a0f1c"
                    />
                </div>
            </div>
        </section>
    );
}
