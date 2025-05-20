import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Flight } from '@shared/schema';
import FlightCard from '@/components/flights/FlightCard';

const FlightBooking = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripType, setTripType] = useState('roundTrip');
  const [searchData, setSearchData] = useState({
    from: 'Delhi (DEL)',
    to: 'Mumbai (BOM)',
    departure: '',
    return: '',
    travelers: '1 Adult, Economy'
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await apiRequest('GET', '/api/flights', undefined);
        const data = await response.json();
        setFlights(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch flights:", error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTripTypeChange = (type: string) => {
    setTripType(type);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate search processing
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="flights" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">Domestic Flights</h2>
          <p className="text-[#457B9D] max-w-2xl mx-auto">Find the best deals on flights to destinations across India</p>
        </div>

        <div className="bg-[#F1FAEE] rounded-lg p-6 mb-10 shadow-md">
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full px-2">
              <div className="flex space-x-6 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only peer" 
                    name="tripType" 
                    checked={tripType === 'roundTrip'} 
                    onChange={() => handleTripTypeChange('roundTrip')}
                  />
                  <div className="w-5 h-5 border-2 border-primary rounded-full mr-2 flex items-center justify-center peer-checked:bg-primary">
                    <div className="w-2 h-2 bg-white rounded-full peer-checked:opacity-100 opacity-0"></div>
                  </div>
                  <span className="text-[#1D3557]">Round Trip</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only peer" 
                    name="tripType" 
                    checked={tripType === 'oneWay'} 
                    onChange={() => handleTripTypeChange('oneWay')}
                  />
                  <div className="w-5 h-5 border-2 border-primary rounded-full mr-2 flex items-center justify-center peer-checked:bg-primary">
                    <div className="w-2 h-2 bg-white rounded-full peer-checked:opacity-100 opacity-0"></div>
                  </div>
                  <span className="text-[#1D3557]">One Way</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    className="sr-only peer" 
                    name="tripType" 
                    checked={tripType === 'multiCity'} 
                    onChange={() => handleTripTypeChange('multiCity')}
                  />
                  <div className="w-5 h-5 border-2 border-primary rounded-full mr-2 flex items-center justify-center peer-checked:bg-primary">
                    <div className="w-2 h-2 bg-white rounded-full peer-checked:opacity-100 opacity-0"></div>
                  </div>
                  <span className="text-[#1D3557]">Multi-City</span>
                </label>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/4 px-2 mb-4">
                <label className="block text-[#1D3557] font-medium mb-2">From</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="from"
                    value={searchData.from}
                    onChange={handleInputChange}
                    placeholder="Delhi (DEL)" 
                    className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <i className="fa-solid fa-plane-departure absolute right-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div className="w-full md:w-1/4 px-2 mb-4">
                <label className="block text-[#1D3557] font-medium mb-2">To</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="to"
                    value={searchData.to}
                    onChange={handleInputChange}
                    placeholder="Mumbai (BOM)" 
                    className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <i className="fa-solid fa-plane-arrival absolute right-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div className="w-full md:w-1/6 px-2 mb-4">
                <label className="block text-[#1D3557] font-medium mb-2">Departure</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="departure"
                    value={searchData.departure}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/6 px-2 mb-4">
                <label className="block text-[#1D3557] font-medium mb-2">Return</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="return"
                    value={searchData.return}
                    onChange={handleInputChange}
                    disabled={tripType === 'oneWay'}
                    className={`w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      tripType === 'oneWay' ? 'bg-gray-100' : ''
                    }`}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/6 px-2 mb-4">
                <label className="block text-[#1D3557] font-medium mb-2">Travelers & Class</label>
                <div className="relative">
                  <select 
                    name="travelers"
                    value={searchData.travelers}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option>1 Adult, Economy</option>
                    <option>2 Adults, Economy</option>
                    <option>2 Adults, 1 Child, Economy</option>
                    <option>1 Adult, Business</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-3 top-3 text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                type="submit"
                className="bg-primary text-white py-3 px-8 rounded-md font-medium hover:bg-opacity-90 transition duration-300 flex items-center"
              >
                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                Search Flights
              </button>
            </div>
          </form>
        </div>

        <h3 className="font-heading font-semibold text-2xl text-[#1D3557] mb-6">Popular Flight Routes</h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.slice(0, 3).map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            href="/flights"
            className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition duration-300"
          >
            View All Flights
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlightBooking;
