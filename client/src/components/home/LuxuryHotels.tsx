import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Hotel } from '@shared/schema';
import HotelCard from '@/components/hotels/HotelCard';

const categories = [
  { id: 'all', name: 'All Hotels' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'heritage', name: 'Heritage' },
  { id: 'beachfront', name: 'Beachfront' },
  { id: 'mountain', name: 'Mountain Retreat' },
  { id: 'wellness', name: 'Wellness & Spa' }
];

const LuxuryHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [_, navigate] = useLocation();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        let url = '/api/hotels';
        if (activeCategory !== 'all') {
          url += `?category=${activeCategory}`;
        }
        
        const response = await apiRequest('GET', url, undefined);
        const data = await response.json();
        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [activeCategory]);

  const handleBookNow = (hotelId: number) => {
    navigate(`/booking/hotel/${hotelId}`);
  };

  return (
    <section id="hotels" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Luxury Hotels</h2>
          <p className="text-[#457B9D] max-w-2xl mx-auto">Experience world-class hospitality with our handpicked selection of India's finest hotels</p>
        </div>
        
        <div className="flex mb-8 overflow-x-auto py-2 space-x-4 no-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 text-[#1D3557] hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-card animate-pulse">
                <div className="h-60 bg-gray-300"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-2/3">
                      <div className="h-5 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 w-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex mb-4 space-x-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    <div className="h-10 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} onBookNow={handleBookNow} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            href="/hotels"
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition duration-300"
          >
            View All Hotels
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LuxuryHotels;
