import TopAnnouncement from '@/components/layout/TopAnnouncement';
import Header from '@/components/layout/Header';
import ScrollExperience3D from '@/components/sections/ScrollExperience3D';
import FeatureHighlights from '@/components/sections/FeatureHighlights';
import ThermalScanner from '@/components/sections/ThermalScanner';
import TechSpecs from '@/components/sections/TechSpecs';
import PressReviews from '@/components/sections/PressReviews';
import OrderForm from '@/components/sections/OrderForm';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/layout/FloatingActions';

export default function Home() {
  return (
    <main>
      <TopAnnouncement />
      <Header />
      {/* Oryzo Scrollytelling 3D Continuous Stage */}
      <ScrollExperience3D />
      {/* Detailed Technical Breakdowns */}
      <FeatureHighlights />
      <ThermalScanner />
      <TechSpecs />
      <PressReviews />
      {/* Batch 01 Reservation / Pre-Order Form */}
      <OrderForm />
      <Footer />
      <FloatingActions />
    </main>
  );
}
