import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Solutions from "@/components/Solutions";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Security from "@/components/Security";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import ScrollProgress from "@/components/ScrollProgress";


export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />

      

      <Problems />
      <Solutions />

      {/* Ad slot — after Solutions, high-visibility, non-intrusive */}
      <div className="bg-white px-4 pb-4">
        <div className="mx-auto max-w-5xl">
          <AdSlot label="In-feed ad" />
        </div>
      </div>

      <Features />
      <HowItWorks />
      <Integrations />

      {/* Ad slot — after tools grid, natural break before pricing */}
      <div className="bg-white px-4 pb-4">
        <div className="mx-auto max-w-5xl">
          <AdSlot label="In-feed ad" />
        </div>
      </div>

      <Pricing />
      <Testimonials />
      <Security />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
