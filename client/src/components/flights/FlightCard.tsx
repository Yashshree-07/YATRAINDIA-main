import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Flight } from '@shared/schema';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const [_, navigate] = useLocation();

  const handleBookNow = () => {
    navigate(`/booking/flight/${flight.id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary transition duration-300 p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img src={flight.airlineLogo} alt={flight.airline} className="w-8 h-8 mr-2" />
          <span className="font-medium text-[#1D3557]">{flight.airline}</span>
        </div>
        <span className={`${
          flight.status === 'On Time' ? 'bg-green-100 text-green-700' : 
          flight.status.includes('Delay') ? 'bg-yellow-100 text-yellow-700' : 
          'bg-red-100 text-red-700'
        } px-2 py-1 rounded text-xs font-medium`}>
          {flight.status}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="block text-xl font-bold text-[#1D3557]">{flight.departureCode}</span>
          <span className="text-sm text-gray-500">{flight.departureCity}</span>
        </div>
        <div className="flex flex-col items-center px-4">
          <span className="text-sm text-gray-500">{flight.duration}</span>
          <div className="w-24 h-px bg-gray-300 relative my-1">
            <div className="absolute w-2 h-2 bg-primary rounded-full -top-0.5 -left-1"></div>
            <div className="absolute w-2 h-2 bg-primary rounded-full -top-0.5 -right-1"></div>
          </div>
          <span className="text-xs text-gray-500">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
        </div>
        <div>
          <span className="block text-xl font-bold text-[#1D3557]">{flight.arrivalCode}</span>
          <span className="text-sm text-gray-500">{flight.arrivalCity}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500">From</span>
          <span className="block font-bold text-[#1D3557] text-lg">₹{flight.price.toLocaleString('en-IN')}</span>
        </div>
        <Button 
          onClick={handleBookNow}
          className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-opacity-90 transition duration-300"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default FlightCard;
