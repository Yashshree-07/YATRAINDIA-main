import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Hotel } from '@shared/schema';

interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (id: number) => void;
}

const HotelCard = ({ hotel, onBookNow }: HotelCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition duration-300">
      <div className="relative">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.name} 
          className="w-full h-60 object-cover"
        />
        {hotel.badge && (
          <span className={`absolute top-4 right-4 ${
            hotel.badge.toLowerCase().includes('popular') ? 'bg-[#F7B801]' : 
            hotel.badge.toLowerCase().includes('off') ? 'bg-[#F7B801]' : 
            'bg-[#1D3557]'
          } text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {hotel.badge}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-xl text-[#1D3557] mb-1">{hotel.name}</h3>
            <p className="text-gray-600 flex items-center mb-3">
              <i className="fa-solid fa-location-dot text-primary mr-2"></i>
              {hotel.location}
            </p>
          </div>
          <div className="bg-yellow-100 text-yellow-700 font-bold rounded px-2 py-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 fill-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {hotel.rating}/10
          </div>
        </div>
        <div className="flex mb-4 flex-wrap">
          {hotel.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs mr-2 mb-1 bg-[#A8DADC] bg-opacity-30 text-[#457B9D] px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4">{hotel.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-[#1D3557] text-xl">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
          <Button 
            onClick={() => onBookNow(hotel.id)}
            className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-opacity-90 transition duration-300"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
