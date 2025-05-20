import { useState } from 'react';
import { useLocation } from 'wouter';

interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}

const HeroSection = () => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '1 Adult'
  });
  const [loading, setLoading] = useState(false);
  const [_, navigate] = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate search processing
    setTimeout(() => {
      setLoading(false);
      navigate('/hotels');
    }, 1000);
  };

  return (
    <section className="pt-20 relative">
      <div className="relative h-[600px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="text-white max-w-xl animate-fade-in-up" style={{ animationDelay: "0s" }}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Discover the Magic of India</h1>
            <p className="text-lg mb-8">Explore ancient temples, vibrant cities, and breathtaking landscapes. Your journey begins here.</p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 max-w-4xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label className="block text-[#1D3557] font-medium mb-2">Where to?</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="destination"
                      value={searchData.destination}
                      onChange={handleInputChange}
                      placeholder="Search destinations" 
                      className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <i className="fa-solid fa-location-dot absolute right-3 top-3 text-gray-400"></i>
                  </div>
                </div>
                <div className="md:w-1/4">
                  <label className="block text-[#1D3557] font-medium mb-2">Check-in</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="checkIn"
                      value={searchData.checkIn}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:w-1/4">
                  <label className="block text-[#1D3557] font-medium mb-2">Check-out</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="checkOut"
                      value={searchData.checkOut}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:w-1/5">
                  <label className="block text-[#1D3557] font-medium mb-2">Guests</label>
                  <div className="relative">
                    <select 
                      name="guests"
                      value={searchData.guests}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>2 Adults, 1 Child</option>
                      <option>2 Adults, 2 Children</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-3 top-3 text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit"
                  className="bg-primary text-white py-3 px-8 rounded-md font-medium hover:bg-opacity-90 transition duration-300 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-magnifying-glass mr-2"></i>
                      Search
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
