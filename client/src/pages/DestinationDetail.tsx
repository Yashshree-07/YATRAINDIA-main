import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Destination, Hotel } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Calendar, Users, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HotelCard from '@/components/hotels/HotelCard';

const DestinationDetail = () => {
  const [match, params] = useRoute<{ id: string }>('/destinations/:id');
  const [destination, setDestination] = useState<Destination | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [_, navigate] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;

      try {
        // Fetch all destinations
        const destinationsResponse = await apiRequest('GET', '/api/destinations', undefined);
        const destinationsData = await destinationsResponse.json();
        
        // Find the specific destination by ID
        const destinationData = destinationsData.find(
          (dest: Destination) => dest.id === Number(params.id)
        );
        
        if (destinationData) {
          setDestination(destinationData);
          
          // Fetch hotels
          const hotelsResponse = await apiRequest('GET', '/api/hotels', undefined);
          const hotelsData = await hotelsResponse.json();
          
          // Filter hotels that match this destination's location
          const destinationHotels = hotelsData.filter((hotel: Hotel) => 
            hotel.location.toLowerCase().includes(destinationData.name.toLowerCase())
          );
          
          setHotels(destinationHotels);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch destination data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  const handleBookHotel = (hotelId: number) => {
    navigate(`/booking/hotel/${hotelId}`);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
          <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-8 w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-10 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-[#1D3557] mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the destination you're looking for. It may have been removed or you might have followed a broken link.
          </p>
          <Button onClick={() => navigate('/destinations')} className="bg-primary hover:bg-primary/90">
            Browse All Destinations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="h-96 w-full relative">
        <img 
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg inline-block">
              <h1 className="text-4xl font-bold text-white mb-2">{destination.name}</h1>
              <div className="flex items-center text-white">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="mr-4">India</span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="mr-2 font-bold">{destination.rating}</span>
                <span className="text-sm">({destination.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="places">Places to Visit</TabsTrigger>
            <TabsTrigger value="stay">Where to Stay</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-[#1D3557] mb-4">About {destination.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {destination.description} {destination.name} is one of India's most cherished destinations, attracting visitors from across the globe with its unique blend of history, culture, and natural beauty.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-[#1D3557] mb-3">Best Time to Visit</h3>
                  <div className="flex items-start mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">October to March</p>
                      <p className="text-gray-600 text-sm">Pleasant weather, ideal for sightseeing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Tourist Traffic</p>
                      <p className="text-gray-600 text-sm">Peak season: December-January</p>
                      <p className="text-gray-600 text-sm">Low season: April-June (Summer)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#1D3557] mb-3">Travel Tips</h3>
                  <div className="flex items-start mb-2">
                    <Info className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Local Transportation</p>
                      <p className="text-gray-600 text-sm">Auto-rickshaws, taxis, and local buses are readily available</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <p className="font-medium">What to Pack</p>
                      <p className="text-gray-600 text-sm">Comfortable walking shoes, light clothing, sun protection</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1D3557] mb-3">Cultural Insights</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {destination.name} represents the rich cultural heritage of India. Visitors can experience traditional arts, crafts, and cuisine that have been preserved through generations. The local markets are filled with handcrafted goods, textiles, and souvenirs unique to this region.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setActiveTab('places')} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Explore Places to Visit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="places" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-[#1D3557] mb-4">Top Places to Visit in {destination.name}</h2>
              <p className="text-gray-700 mb-6">
                Discover the must-visit attractions and hidden gems that make {destination.name} special.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Place 1 */}
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/featured/?${destination.name},landmark`} 
                      alt={`${destination.name} Landmark`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Historical Monuments</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Explore the ancient architecture and historical significance of monuments in {destination.name}.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Central {destination.name}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Place 2 */}
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/featured/?${destination.name},market`} 
                      alt={`${destination.name} Market`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Local Markets</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Experience the vibrant culture and shop for unique handicrafts and souvenirs.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Downtown {destination.name}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Place 3 */}
                <Card className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/featured/?${destination.name},nature`} 
                      alt={`${destination.name} Nature`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Natural Attractions</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Visit scenic spots and natural wonders around {destination.name}.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Outskirts of {destination.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#1D3557] mb-3">Guided Tours & Experiences</h3>
                <p className="text-gray-700 mb-4">
                  Make the most of your visit with expert guides who can share local insights and stories.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setActiveTab('stay')} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Find Places to Stay
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stay" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-[#1D3557] mb-4">Accommodations in {destination.name}</h2>
              <p className="text-gray-700 mb-6">
                From luxury hotels to budget-friendly options, find the perfect place to stay in {destination.name}.
              </p>

              {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {hotels.map((hotel) => (
                    <HotelCard 
                      key={hotel.id} 
                      hotel={hotel} 
                      onBookNow={handleBookHotel} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center bg-gray-50 py-10 rounded-lg mb-8">
                  <div className="text-4xl mb-3">🏨</div>
                  <h3 className="text-lg font-semibold text-[#1D3557] mb-2">No Hotels Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-4">
                    We couldn't find any hotels specifically in {destination.name}. Browse all hotels to find accommodations near this destination.
                  </p>
                  <Button 
                    onClick={() => navigate('/hotels')} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Browse All Hotels
                  </Button>
                </div>
              )}

              <Separator className="my-6" />

              <div>
                <h3 className="text-xl font-semibold text-[#1D3557] mb-3">Travel Packages</h3>
                <p className="text-gray-700 mb-4">
                  Check out our exclusive travel packages that include accommodations, guided tours, and more.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/deals')} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    View Travel Packages
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#1D3557] mb-4">Plan Your Trip to {destination.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-5 text-center">
                <div className="text-primary text-4xl mb-3">✈️</div>
                <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Book Flights</h3>
                <p className="text-sm text-gray-600 mb-3">Find the best flights to {destination.name}</p>
                <Button 
                  onClick={() => navigate('/flights')} 
                  className="bg-primary hover:bg-primary/90 w-full"
                >
                  Search Flights
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardContent className="p-5 text-center">
                <div className="text-primary text-4xl mb-3">🏨</div>
                <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Book Hotels</h3>
                <p className="text-sm text-gray-600 mb-3">Find accommodations in {destination.name}</p>
                <Button 
                  onClick={() => navigate('/hotels')} 
                  className="bg-primary hover:bg-primary/90 w-full"
                >
                  Search Hotels
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardContent className="p-5 text-center">
                <div className="text-primary text-4xl mb-3">🎫</div>
                <h3 className="text-lg font-semibold text-[#1D3557] mb-1">Find Deals</h3>
                <p className="text-sm text-gray-600 mb-3">Get special offers on packages</p>
                <Button 
                  onClick={() => navigate('/deals')} 
                  className="bg-primary hover:bg-primary/90 w-full"
                >
                  View Deals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;