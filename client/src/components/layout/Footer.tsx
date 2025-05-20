import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-[#1D3557] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <i className="fa-solid fa-om text-[#F7B801] text-3xl mr-2"></i>
              <span className="text-white font-heading font-bold text-2xl">Yatra<span className="text-[#F7B801]">India</span></span>
            </div>
            <p className="text-[#A8DADC] mb-6">Discover the beauty and diversity of India with our curated travel experiences, luxury accommodations, and seamless flight bookings.</p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#457B9D] hover:bg-[#F7B801] transition duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="bg-[#457B9D] hover:bg-[#F7B801] transition duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="bg-[#457B9D] hover:bg-[#F7B801] transition duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="bg-[#457B9D] hover:bg-[#F7B801] transition duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Home</Link></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">About Us</a></li>
              <li><Link href="/hotels" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Hotels</Link></li>
              <li><Link href="/flights" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Flights</Link></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Destinations</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Packages</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Contact Us</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">FAQs</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Cancellation Policy</a></li>
              <li><a href="#" className="text-[#A8DADC] hover:text-[#F7B801] transition duration-300">Customer Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fa-solid fa-location-dot mt-1 mr-3 text-[#F7B801]"></i>
                <span className="text-[#A8DADC]">123 Tourism Avenue, Connaught Place,<br/>New Delhi, 110001, India</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-phone mr-3 text-[#F7B801]"></i>
                <span className="text-[#A8DADC]">+91 1234 567890</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-envelope mr-3 text-[#F7B801]"></i>
                <span className="text-[#A8DADC]">info@yatraindia.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#457B9D] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#A8DADC] text-sm mb-4 md:mb-0">© 2023 YatraIndia. All rights reserved.</p>
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 mx-2"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 mx-2"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6 mx-2"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6 mx-2"/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
