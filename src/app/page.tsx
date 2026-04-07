import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import NNSpectrumSection from "@/components/NNSpectrumSection";
import ProjectsContainer from "@/components/ProjectsContainer";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main>
        <HeroSection />
        <NNSpectrumSection />
        <ProjectsContainer />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
