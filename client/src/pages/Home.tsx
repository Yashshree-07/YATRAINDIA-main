import HeroSection from '@/components/home/HeroSection';
import PopularDestinations from '@/components/home/PopularDestinations';
import LuxuryHotels from '@/components/home/LuxuryHotels';
import FlightBooking from '@/components/home/FlightBooking';
import TravelExperience from '@/components/home/TravelExperience';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <PopularDestinations />
      <LuxuryHotels />
      <FlightBooking />
      <TravelExperience />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
