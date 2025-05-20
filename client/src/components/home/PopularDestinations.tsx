import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Destination } from '@shared/schema';

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiRequest('GET', '/api/destinations', undefined);
        const data = await response.json();
        setDestinations(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Popular Destinations</h2>
          <p className="text-[#457B9D] max-w-2xl mx-auto">Explore India's most beloved travel destinations and start planning your next adventure</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-card animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className="destination-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="font-heading font-semibold text-white text-xl">{destination.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="flex text-[#F7B801]">
                      {[...Array(Math.floor(destination.rating))].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                      {destination.rating % 1 !== 0 && (
                        <i className="fa-solid fa-star-half-alt"></i>
                      )}
                      {[...Array(5 - Math.ceil(destination.rating))].map((_, i) => (
                        <i key={i} className="fa-regular fa-star"></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{destination.rating.toFixed(1)} ({destination.reviewCount} reviews)</span>
                  </div>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1D3557]">Starts at ₹{destination.startingPrice.toLocaleString('en-IN')}</span>
                    <Link href={`/destinations/${destination.id}`} className="text-primary font-medium hover:underline">
                      Explore <i className="fa-solid fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            href="/destinations" 
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition duration-300"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
