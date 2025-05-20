import { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { apiRequest } from '@/lib/queryClient';
import { Destination } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [_, navigate] = useLocation();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiRequest('GET', '/api/destinations', undefined);
        const data = await response.json();
        setDestinations(data);
        setFilteredDestinations(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    let filtered = [...destinations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(destination => 
        destination.name.toLowerCase().includes(query) || 
        destination.description.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    switch (activeTab) {
      case 'popular':
        filtered = filtered.filter(destination => {
          const rating = typeof destination.rating === 'string' 
            ? parseFloat(destination.rating) 
            : Number(destination.rating);
          return rating >= 4.7;
        });
        break;
      case 'budget':
        filtered = filtered.filter(destination => destination.startingPrice < 3000);
        break;
      case 'luxury':
        filtered = filtered.filter(destination => destination.startingPrice >= 3000);
        break;
    }

    setFilteredDestinations(filtered);
  }, [searchQuery, activeTab, destinations]);

  const handleExplore = (destinationId: number) => {
    navigate(`/destinations/${destinationId}`);
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Explore Destinations in India</h1>
          <p className="text-[#457B9D]">Discover the beauty and diversity of incredible India's top travel destinations</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-4"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Destinations</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="budget">Budget Friendly</TabsTrigger>
              <TabsTrigger value="luxury">Luxury Getaways</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Destination Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
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
        ) : filteredDestinations.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <i className="fa-solid fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
            <h3 className="font-heading font-semibold text-xl text-[#1D3557] mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-100 rounded-full px-3 py-1 text-sm font-medium text-yellow-700 flex items-center shadow-sm">
                    <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold">{destination.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-xl text-[#1D3557] mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{destination.reviewCount} reviews</p>
                      <p className="font-medium text-[#1D3557]">From ₹{destination.startingPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <Button 
                      onClick={() => handleExplore(destination.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;