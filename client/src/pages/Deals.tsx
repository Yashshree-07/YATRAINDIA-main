import { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { apiRequest } from '@/lib/queryClient';
import { Hotel, Flight } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Clock, Percent } from 'lucide-react';

const Deals = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [_, navigate] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsResponse, flightsResponse] = await Promise.all([
          apiRequest('GET', '/api/hotels', undefined),
          apiRequest('GET', '/api/flights', undefined)
        ]);
        
        const hotelsData = await hotelsResponse.json();
        const flightsData = await flightsResponse.json();
        
        // Add deal property to some hotels and flights for demonstration
        const hotelsWithDeals = hotelsData.map((hotel: Hotel) => ({
          ...hotel,
          deal: Math.random() > 0.5 ? {
            type: Math.random() > 0.5 ? 'DISCOUNT' : 'PACKAGE',
            value: Math.floor(Math.random() * 30) + 10, // 10-40% discount
            expiry: new Date(Date.now() + (Math.random() * 14 + 1) * 86400000) // 1-15 days
          } : null
        }));
        
        const flightsWithDeals = flightsData.map((flight: Flight) => ({
          ...flight,
          deal: Math.random() > 0.5 ? {
            type: Math.random() > 0.5 ? 'DISCOUNT' : 'CASHBACK',
            value: Math.floor(Math.random() * 20) + 5, // 5-25% discount
            expiry: new Date(Date.now() + (Math.random() * 10 + 1) * 86400000) // 1-11 days
          } : null
        }));
        
        setHotels(hotelsWithDeals);
        setFlights(flightsWithDeals);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getFilteredHotels = () => {
    switch(activeTab) {
      case 'discount':
        return hotels.filter(hotel => hotel.deal && hotel.deal.type === 'DISCOUNT');
      case 'package':
        return hotels.filter(hotel => hotel.deal && hotel.deal.type === 'PACKAGE');
      case 'all':
      default:
        return hotels.filter(hotel => hotel.deal);
    }
  };

  const getFilteredFlights = () => {
    switch(activeTab) {
      case 'discount':
        return flights.filter(flight => flight.deal && flight.deal.type === 'DISCOUNT');
      case 'cashback':
        return flights.filter(flight => flight.deal && flight.deal.type === 'CASHBACK');
      case 'all':
      default:
        return flights.filter(flight => flight.deal);
    }
  };

  const handleHotelBook = (hotelId: number) => {
    navigate(`/booking/hotel/${hotelId}`);
  };

  const handleFlightBook = (flightId: number) => {
    navigate(`/booking/flight/${flightId}`);
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">
            Hot Deals & Offers
          </h1>
          <p className="text-[#457B9D]">Limited-time offers and exclusive deals on flights and hotels across India</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Deals</TabsTrigger>
            <TabsTrigger value="discount">Discounts</TabsTrigger>
            <TabsTrigger value="package">Packages</TabsTrigger>
            <TabsTrigger value="cashback">Cashbacks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <div>
              <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Hotel Deals</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              ) : getFilteredHotels().length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">No hotel deals available right now. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getFilteredHotels().map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg relative">
                      {hotel.deal && (
                        <div className="absolute top-4 left-0 z-10">
                          <Badge className="bg-red-600 text-white rounded-r-full rounded-l-none px-3 py-1 text-sm font-semibold shadow-md">
                            {hotel.deal.type === 'DISCOUNT' ? (
                              <span>{hotel.deal.value}% OFF</span>
                            ) : (
                              <span>Package Deal</span>
                            )}
                          </Badge>
                        </div>
                      )}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-heading font-semibold text-lg text-[#1D3557] mb-1">{hotel.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.location}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Expires on {formatDate(hotel.deal?.expiry)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-500 line-through text-sm">₹{(hotel.pricePerNight * 1.2).toFixed(0)}</p>
                            <p className="font-semibold text-[#1D3557]">₹{hotel.pricePerNight.toLocaleString('en-IN')}</p>
                          </div>
                          <Button onClick={() => handleHotelBook(hotel.id)} className="bg-primary hover:bg-primary/90">
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Flight Deals</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                      <div className="p-6">
                        <div className="flex justify-between mb-4">
                          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
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
              ) : getFilteredFlights().length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">No flight deals available right now. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getFilteredFlights().map((flight) => (
                    <Card key={flight.id} className="transition-all duration-300 hover:shadow-lg relative">
                      {flight.deal && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
                            {flight.deal.type === 'DISCOUNT' ? (
                              <span>{flight.deal.value}% OFF</span>
                            ) : (
                              <span>{flight.deal.value}% Cashback</span>
                            )}
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <img 
                              src={flight.airlineLogo} 
                              alt={flight.airline} 
                              className="h-8 w-8 object-contain mr-2"
                            />
                            <span className="font-medium text-[#1D3557]">{flight.airline}</span>
                          </div>
                          <span className="text-gray-500 text-sm">{flight.flightNumber}</span>
                        </div>
                        
                        <div className="flex justify-between mb-3">
                          <div>
                            <div className="text-lg font-semibold">{flight.departureTime}</div>
                            <div className="text-sm text-gray-500">{flight.origin}</div>
                          </div>
                          <div className="flex flex-col items-center justify-center px-2">
                            <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                            <div className="w-20 h-[1px] bg-gray-300 relative">
                              <div className="absolute top-0 right-0 w-1 h-1 bg-gray-400 rounded-full transform translate-x-1 -translate-y-1/2"></div>
                              <div className="absolute top-0 left-0 w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1 -translate-y-1/2"></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Direct</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{flight.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{flight.destination}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{flight.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Tag className="h-4 w-4 mr-1" />
                          <span>Deal ends {formatDate(flight.deal?.expiry)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-500 line-through text-sm">₹{(flight.price * 1.15).toFixed(0)}</p>
                            <p className="font-semibold text-[#1D3557]">₹{flight.price.toLocaleString('en-IN')}</p>
                          </div>
                          <Button onClick={() => handleFlightBook(flight.id)} className="bg-primary hover:bg-primary/90">
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="discount">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Discounted Hotels</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                ) : getFilteredHotels().length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500">No discounted hotels available right now. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFilteredHotels().map((hotel) => (
                      <Card key={hotel.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg relative">
                        <div className="absolute top-4 left-0 z-10">
                          <Badge className="bg-red-600 text-white rounded-r-full rounded-l-none px-3 py-1 text-sm font-semibold shadow-md">
                            <Percent className="h-3 w-3 mr-1" />
                            <span>{hotel.deal?.value}% OFF</span>
                          </Badge>
                        </div>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-heading font-semibold text-lg text-[#1D3557] mb-1">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.location}</p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Expires on {formatDate(hotel.deal?.expiry)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-500 line-through text-sm">₹{(hotel.pricePerNight * 1.2).toFixed(0)}</p>
                              <p className="font-semibold text-[#1D3557]">₹{hotel.pricePerNight.toLocaleString('en-IN')}</p>
                            </div>
                            <Button onClick={() => handleHotelBook(hotel.id)} className="bg-primary hover:bg-primary/90">
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Discounted Flights</h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                        <div className="p-6">
                          <div className="flex justify-between mb-4">
                            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          </div>
                          <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
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
                ) : getFilteredFlights().length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500">No discounted flights available right now. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFilteredFlights().map((flight) => (
                      <Card key={flight.id} className="transition-all duration-300 hover:shadow-lg relative">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-green-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
                            <Percent className="h-3 w-3 mr-1" />
                            <span>{flight.deal?.value}% OFF</span>
                          </Badge>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <img 
                                src={flight.airlineLogo} 
                                alt={flight.airline} 
                                className="h-8 w-8 object-contain mr-2"
                              />
                              <span className="font-medium text-[#1D3557]">{flight.airline}</span>
                            </div>
                            <span className="text-gray-500 text-sm">{flight.flightNumber}</span>
                          </div>
                          
                          <div className="flex justify-between mb-3">
                            <div>
                              <div className="text-lg font-semibold">{flight.departureTime}</div>
                              <div className="text-sm text-gray-500">{flight.origin}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center px-2">
                              <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                              <div className="w-20 h-[1px] bg-gray-300 relative">
                                <div className="absolute top-0 right-0 w-1 h-1 bg-gray-400 rounded-full transform translate-x-1 -translate-y-1/2"></div>
                                <div className="absolute top-0 left-0 w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1 -translate-y-1/2"></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Direct</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold">{flight.arrivalTime}</div>
                              <div className="text-sm text-gray-500">{flight.destination}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{flight.date}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Tag className="h-4 w-4 mr-1" />
                            <span>Deal ends {formatDate(flight.deal?.expiry)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-500 line-through text-sm">₹{(flight.price * 1.15).toFixed(0)}</p>
                              <p className="font-semibold text-[#1D3557]">₹{flight.price.toLocaleString('en-IN')}</p>
                            </div>
                            <Button onClick={() => handleFlightBook(flight.id)} className="bg-primary hover:bg-primary/90">
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="package">
            <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Package Deals</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            ) : getFilteredHotels().length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No package deals available right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getFilteredHotels().map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg relative">
                    <div className="absolute top-4 left-0 z-10">
                      <Badge className="bg-blue-600 text-white rounded-r-full rounded-l-none px-3 py-1 text-sm font-semibold shadow-md">
                        <span>Package Deal</span>
                      </Badge>
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold text-lg text-[#1D3557] mb-1">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.location}</p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
                        <p className="text-sm text-blue-700">
                          Package includes: 3 nights stay, airport transfers, breakfast, and guided tour
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Expires on {formatDate(hotel.deal?.expiry)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 line-through text-sm">₹{(hotel.pricePerNight * 4).toFixed(0)}</p>
                          <p className="font-semibold text-[#1D3557]">₹{(hotel.pricePerNight * 3).toLocaleString('en-IN')}</p>
                        </div>
                        <Button onClick={() => handleHotelBook(hotel.id)} className="bg-primary hover:bg-primary/90">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cashback">
            <h2 className="font-heading font-semibold text-2xl text-[#1D3557] mb-4">Cashback Offers</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                    <div className="p-6">
                      <div className="flex justify-between mb-4">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
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
            ) : getFilteredFlights().length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No cashback offers available right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getFilteredFlights().map((flight) => (
                  <Card key={flight.id} className="transition-all duration-300 hover:shadow-lg relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-purple-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
                        <span>{flight.deal?.value}% Cashback</span>
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <img 
                            src={flight.airlineLogo} 
                            alt={flight.airline} 
                            className="h-8 w-8 object-contain mr-2"
                          />
                          <span className="font-medium text-[#1D3557]">{flight.airline}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{flight.flightNumber}</span>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <div>
                          <div className="text-lg font-semibold">{flight.departureTime}</div>
                          <div className="text-sm text-gray-500">{flight.origin}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center px-2">
                          <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                          <div className="w-20 h-[1px] bg-gray-300 relative">
                            <div className="absolute top-0 right-0 w-1 h-1 bg-gray-400 rounded-full transform translate-x-1 -translate-y-1/2"></div>
                            <div className="absolute top-0 left-0 w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1 -translate-y-1/2"></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Direct</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{flight.arrivalTime}</div>
                          <div className="text-sm text-gray-500">{flight.destination}</div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-md p-2 mb-3">
                        <p className="text-sm text-purple-700">
                          {flight.deal?.value}% cashback will be credited to your wallet within 24 hours of booking
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{flight.date}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Offer ends {formatDate(flight.deal?.expiry)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#1D3557]">₹{flight.price.toLocaleString('en-IN')}</p>
                        </div>
                        <Button onClick={() => handleFlightBook(flight.id)} className="bg-primary hover:bg-primary/90">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Deals;