import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Hotel } from '@shared/schema';
import HotelCard from '@/components/hotels/HotelCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [selectedFilters, setSelectedFilters] = useState<{
    amenities: string[];
    rating: number | null;
    sortBy: string;
  }>({
    amenities: [],
    rating: null,
    sortBy: 'popularity'
  });
  
  const [_, navigate] = useLocation();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await apiRequest('GET', '/api/hotels', undefined);
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    let filtered = [...hotels];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(hotel => 
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(hotel => 
      hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1]
    );
    
    // Apply amenities filter
    if (selectedFilters.amenities.length > 0) {
      filtered = filtered.filter(hotel => 
        selectedFilters.amenities.every(amenity => 
          hotel.amenities.includes(amenity)
        )
      );
    }
    
    // Apply rating filter
    if (selectedFilters.rating) {
      const ratingValue = selectedFilters.rating;
      filtered = filtered.filter(hotel => {
        const hotelRating = typeof hotel.rating === 'string' 
          ? parseFloat(hotel.rating) 
          : Number(hotel.rating);
        return hotelRating >= ratingValue;
      });
    }
    
    // Apply sorting
    switch (selectedFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : Number(a.rating);
          const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : Number(b.rating);
          return ratingB - ratingA;
        });
        break;
      default: // popularity is default
        // Assuming popularity is already sorted in the original data
        break;
    }
    
    setFilteredHotels(filtered);
  }, [hotels, searchQuery, priceRange, selectedFilters]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const amenities = checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity);
      
      return { ...prev, amenities };
    });
  };

  const handleBookNow = (hotelId: number) => {
    navigate(`/booking/hotel/${hotelId}`);
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Explore Hotels in India</h1>
          <p className="text-[#457B9D]">Discover luxurious stays, heritage properties, and comfortable accommodations</p>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Input
                type="text"
                placeholder="Search by hotel name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-semibold text-lg text-[#1D3557] mb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-[#1D3557] mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[1000, 50000]}
                    min={1000}
                    max={50000}
                    step={1000}
                    onValueChange={(value) => setPriceRange(value)}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-[#1D3557] mb-2">Hotel Rating</h4>
                <Select 
                  onValueChange={(value) => setSelectedFilters(prev => ({ 
                    ...prev, 
                    rating: value === "0" ? null : Number(value) 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="9">9+ Excellent</SelectItem>
                    <SelectItem value="8">8+ Very Good</SelectItem>
                    <SelectItem value="7">7+ Good</SelectItem>
                    <SelectItem value="6">6+ Pleasant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-[#1D3557] mb-2">Amenities</h4>
                <div className="space-y-2">
                  {['Wi-Fi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', 'Airport Shuttle'].map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity}
                        checked={selectedFilters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#1D3557] mb-2">Sort By</h4>
                <Select 
                  defaultValue="popularity"
                  onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Popularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Hotel Listings */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
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
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <i className="fa-solid fa-hotel text-4xl text-gray-300 mb-4"></i>
                <h3 className="font-heading font-semibold text-xl text-[#1D3557] mb-2">No hotels found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} onBookNow={handleBookNow} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
