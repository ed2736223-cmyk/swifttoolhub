import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Solutions from "@/components/Solutions";
import AboutIntro from "@/components/AboutIntro";
import ToolCategories from "@/components/ToolCategories";
import SignupGuide from "@/components/SignupGuide";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Principles from "@/components/Principles";
import Pricing from "@/components/Pricing";
import Security from "@/components/Security";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import ScrollProgress from "@/components/ScrollProgress";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "SwiftToolHub — Free Online Tools to Get Everything Done" },
  description:
    "SwiftToolHub is a free online toolkit of converters, generators, checkers and calculators. No sign-up for core tools, and most processing happens right in your browser.",
  alternates: {
    canonical: "https://swifttoolhub.com",
  },
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
<AboutIntro />
      <Problems />
      <Solutions />
      
      <ToolCategories />

      {/* Ad slot — natural break after the category overview */}
      <div className="bg-white px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <AdSlot label="In-feed ad" />
        </div>
      </div>

      <SignupGuide />
      <Features />
      <HowItWorks />

      {/* Ad slot — natural break before the principles + pricing */}
      <div className="bg-white px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <AdSlot label="In-feed ad" />
        </div>
      </div>

      <Principles />
      <Pricing />
     
      <Security />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
