import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Flight } from '@shared/schema';
import FlightCard from '@/components/flights/FlightCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const Flights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    airlines: [] as string[]
  });
  const [priceRange, setPriceRange] = useState([1000, 20000]);
  const [sortBy, setSortBy] = useState('departure');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await apiRequest('GET', '/api/flights', undefined);
        const data = await response.json();
        setFlights(data);
        setFilteredFlights(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  useEffect(() => {
    let filtered = [...flights];
    
    // Apply from filter
    if (searchData.from) {
      filtered = filtered.filter(flight => 
        flight.departureCity.toLowerCase().includes(searchData.from.toLowerCase()) ||
        flight.departureCode.toLowerCase().includes(searchData.from.toLowerCase())
      );
    }
    
    // Apply to filter
    if (searchData.to) {
      filtered = filtered.filter(flight => 
        flight.arrivalCity.toLowerCase().includes(searchData.to.toLowerCase()) ||
        flight.arrivalCode.toLowerCase().includes(searchData.to.toLowerCase())
      );
    }
    
    // Apply airline filter
    if (searchData.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        searchData.airlines.includes(flight.airline)
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(flight => 
      flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].split('m')[0]);
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].split('m')[0]);
          return durationA - durationB;
        });
        break;
      default: // departure is default
        // No specific sort needed, using default order
        break;
    }
    
    setFilteredFlights(filtered);
  }, [flights, searchData, priceRange, sortBy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    setSearchData(prev => {
      const airlines = checked 
        ? [...prev.airlines, airline]
        : prev.airlines.filter(a => a !== airline);
      
      return { ...prev, airlines };
    });
  };

  const handleReset = () => {
    setSearchData({
      from: '',
      to: '',
      departure: '',
      airlines: []
    });
    setPriceRange([1000, 20000]);
    setSortBy('departure');
  };

  // Get unique airlines
  const airlines = Array.from(new Set(flights.map(flight => flight.airline)));

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Find Flights Across India</h1>
          <p className="text-[#457B9D]">Compare flights, airlines, and prices to find the perfect journey</p>
        </div>
        
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="from" className="text-[#1D3557] font-medium">From</Label>
              <div className="relative">
                <Input 
                  id="from"
                  name="from"
                  value={searchData.from}
                  onChange={handleInputChange}
                  placeholder="City or airport code"
                  className="pl-10"
                />
                <i className="fa-solid fa-plane-departure absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            <div>
              <Label htmlFor="to" className="text-[#1D3557] font-medium">To</Label>
              <div className="relative">
                <Input 
                  id="to"
                  name="to"
                  value={searchData.to}
                  onChange={handleInputChange}
                  placeholder="City or airport code" 
                  className="pl-10"
                />
                <i className="fa-solid fa-plane-arrival absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            <div>
              <Label htmlFor="departure" className="text-[#1D3557] font-medium">Departure Date</Label>
              <Input 
                id="departure"
                name="departure"
                type="date"
                value={searchData.departure}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Filters and Listings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-semibold text-lg text-[#1D3557]">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  className="text-primary text-sm"
                >
                  Reset
                </Button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-[#1D3557] mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[1000, 20000]}
                    min={1000}
                    max={20000}
                    step={500}
                    value={priceRange}
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
                <h4 className="font-medium text-[#1D3557] mb-2">Airlines</h4>
                <div className="space-y-2">
                  {airlines.map(airline => (
                    <div key={airline} className="flex items-center space-x-2">
                      <Checkbox 
                        id={airline}
                        checked={searchData.airlines.includes(airline)}
                        onCheckedChange={(checked) => handleAirlineChange(airline, checked as boolean)}
                      />
                      <Label htmlFor={airline} className="text-sm">{airline}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#1D3557] mb-2">Sort By</h4>
                <Select 
                  defaultValue="departure"
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Departure Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="departure">Departure Time</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Flight Listings */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="h-6 w-12 bg-gray-300 rounded mb-1"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex flex-col items-center px-4">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        <div className="w-24 h-px bg-gray-300 my-1"></div>
                        <div className="h-3 w-14 bg-gray-200 rounded"></div>
                      </div>
                      <div>
                        <div className="h-6 w-12 bg-gray-300 rounded mb-1"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="h-3 w-10 bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-16 bg-gray-300 rounded"></div>
                      </div>
                      <div className="h-10 w-24 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <i className="fa-solid fa-plane text-4xl text-gray-300 mb-4"></i>
                <h3 className="font-heading font-semibold text-xl text-[#1D3557] mb-2">No flights found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
