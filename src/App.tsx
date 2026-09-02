import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import SmartInvitations from "./components/SmartInvitations";
import Gallery from "./components/Gallery";
import WhyZeonix from "./components/WhyZeonix";
import AboutUs from "./components/AboutUs";
import ContactOrder from "./components/ContactOrder";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <SmartInvitations />
        <Gallery />
        <WhyZeonix />
        <AboutUs />
        <ContactOrder />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
