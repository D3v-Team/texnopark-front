import Hero from "../Components/Home/Hero";
import AboutContent from "../Components/AboutUs/AboutContent";
import InstituteStats from "../Components/Home/InsState";
import Inter from "../Components/Home/Inter";
import UpEvent from "../Components/Home/UpEvent";
import Links from "../Components/Home/Links";
import News from "../Components/Home/News";
import ContactHero from "../Components/Contact/ContactHero";

export default function Home() {
    return (
        <main className="home relative">
            <Hero />
            <AboutContent compact />
            <News />
            <UpEvent />
            <InstituteStats />
            <Inter />
            <Links />
            <div id="contact-section">
                <ContactHero />
            </div>
        </main>
    );
}
