import { useTranslation } from "react-i18next";
import { Flag, ShieldCheck, Music } from "lucide-react";

const NAVY      = '#f1f5f9';
const NAVY_SOFT = 'rgba(203,213,225,0.85)';
const ORANGE    = '#ea6c0a';
const DARK_BG   = '#0a0f1c';
const CARD_BG   = '#151d32';
const CARD_BORDER = '#1e2d4a';

export default function SymbolsContent() {
    const { t } = useTranslation();

    return (
        <section className="symbols_content py-12 mt-[120px]" style={{ background: DARK_BG }}>
            <div className="Container flex flex-col gap-8">

                {/* ── Bayroq ── */}
                <div className="symbol_flag rounded-[28px] p-7 md:p-10"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(234,108,10,0.12)', border: '1.5px solid rgba(234,108,10,0.3)' }}>
                            <Flag size={22} strokeWidth={1.8} color={ORANGE} aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl md:text-[28px] leading-tight mb-2" style={{ color: NAVY }}>
                                {t("symbols_madhiy_title")}
                            </h1>
                            <div className="w-12 h-1 rounded-full" style={{ background: ORANGE }} />
                        </div>
                    </div>
                    <p className="font-normal text-base leading-[1.85]" style={{ color: NAVY_SOFT }}>
                        {t("symbols_flag_paragraph1")} <br />
                        {t("symbols_flag_paragraph2")} <br />
                        {t("symbols_flag_paragraph3")} <br />
                        {t("symbols_flag_paragraph4")} <br />
                        {t("symbols_flag_paragraph5")} <br />
                        {t("symbols_flag_paragraph6")} <br />
                        {t("symbols_flag_paragraph7")} <br />
                        {t("symbols_flag_paragraph8")} <br />
                        {t("symbols_flag_paragraph9")} <br />
                        {t("symbols_flag_paragraph10")}
                    </p>
                </div>

                {/* ── Gerb ── */}
                <div className="symbol_g rounded-[28px] p-7 md:p-10"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(234,108,10,0.12)', border: '1.5px solid rgba(234,108,10,0.3)' }}>
                            <ShieldCheck size={22} strokeWidth={1.8} color={ORANGE} aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl md:text-[28px] leading-tight mb-2" style={{ color: NAVY }}>
                                {t("symbols_gerb_title")}
                            </h1>
                            <div className="w-12 h-1 rounded-full" style={{ background: ORANGE }} />
                        </div>
                    </div>
                    <p className="font-normal text-base leading-[1.85]" style={{ color: NAVY_SOFT }}>
                        {t("symbols_gerb_paragraph1")} <br />
                        {t("symbols_gerb_paragraph2")} <br />
                        {t("symbols_gerb_paragraph3")} <br />
                        {t("symbols_gerb_paragraph4")} <br />
                        {t("symbols_gerb_paragraph5")}
                    </p>
                </div>

                {/* ── Madhiya ── */}
                <div className="symbol_m rounded-[28px] p-7 md:p-10"
                    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(234,108,10,0.12)', border: '1.5px solid rgba(234,108,10,0.3)' }}>
                            <Music size={22} strokeWidth={1.8} color={ORANGE} aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl md:text-[28px] leading-tight mb-2" style={{ color: NAVY }}>
                                {t("symbols_madhiy_title")}
                            </h1>
                            <div className="w-12 h-1 rounded-full" style={{ background: ORANGE }} />
                        </div>
                    </div>

                    <p className="font-normal text-base leading-[1.85] mb-6" style={{ color: NAVY_SOFT }}>
                        {t("symbols_madhiy_description")}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold"
                            style={{ background: 'rgba(234,108,10,0.12)', color: ORANGE, border: '1px solid rgba(234,108,10,0.25)' }}>
                            {t("symbols_madhiy_music")}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {t("symbols_madhiy_lyrics")}
                        </span>
                    </div>

                    <div className="rounded-2xl p-6 md:p-8"
                        style={{ background: '#0d1526', borderLeft: `3px solid ${ORANGE}` }}>
                        <p className="font-normal text-base leading-[1.9] italic" style={{ color: '#cbd5e1' }}>
                            {t("symbols_madhiy_verse1_line1")} <br />
                            {t("symbols_madhiy_verse1_line2")} <br />
                            {t("symbols_madhiy_verse1_line3")} <br />
                            {t("symbols_madhiy_verse1_line4")} <br />
                            <br />
                            {t("symbols_madhiy_chorus_line1")} <br />
                            {t("symbols_madhiy_chorus_line2")} <br />
                            {t("symbols_madhiy_chorus_line3")} <br />
                            {t("symbols_madhiy_chorus_line4")} <br />
                            <br />
                            {t("symbols_madhiy_verse2_line1")} <br />
                            {t("symbols_madhiy_verse2_line2")} <br />
                            {t("symbols_madhiy_verse2_line3")} <br />
                            {t("symbols_madhiy_verse2_line4")} <br />
                            <br />
                            {t("symbols_madhiy_chorus_repeat_line1")} <br />
                            {t("symbols_madhiy_chorus_repeat_line2")} <br />
                            {t("symbols_madhiy_chorus_repeat_line3")} <br />
                            {t("symbols_madhiy_chorus_repeat_line4")} <br />
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}