import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import { logout } from '@/lib/authUtils';
import { Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [location] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } else {
      toast({
        title: "Logout failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <i className="fa-solid fa-om text-primary text-3xl mr-2"></i>
                <span className="text-[#1D3557] font-heading font-bold text-2xl">Yatra<span className="text-primary">India</span></span>
              </Link>
              <div className="hidden md:flex ml-10">
                <Link href="/" className={`nav-link text-[#1D3557] mx-3 font-medium relative ${location === '/' ? 'after:w-full' : ''}`}>Home</Link>
                <Link href="/hotels" className={`nav-link text-[#1D3557] mx-3 font-medium relative ${location === '/hotels' ? 'after:w-full' : ''}`}>Hotels</Link>
                <Link href="/flights" className={`nav-link text-[#1D3557] mx-3 font-medium relative ${location === '/flights' ? 'after:w-full' : ''}`}>Flights</Link>
                <Link href="/destinations" className={`nav-link text-[#1D3557] mx-3 font-medium relative ${location === '/destinations' ? 'after:w-full' : ''}`}>Destinations</Link>
                <Link href="/deals" className={`nav-link text-[#1D3557] mx-3 font-medium relative ${location === '/deals' ? 'after:w-full' : ''}`}>Deals</Link>
              </div>
            </div>
            <div className="flex items-center">
              {currentUser ? (
                <div className="hidden md:flex items-center">
                  <span className="mr-4 text-[#1D3557]">Hello, {currentUser.displayName || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-opacity-90 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex">
                  <button 
                    onClick={() => setIsLoginModalOpen(true)} 
                    className="px-4 py-2 border border-primary text-primary rounded font-medium hover:bg-primary hover:text-white transition duration-300 mr-3"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsSignupModalOpen(true)} 
                    className="px-4 py-2 bg-primary text-white rounded font-medium hover:bg-opacity-90 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              <button 
                className="md:hidden text-[#1D3557] text-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 px-2 border-t mt-2">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="text-[#1D3557] py-2 px-3 hover:bg-gray-100 rounded-md">Home</Link>
                <Link href="/hotels" className="text-[#1D3557] py-2 px-3 hover:bg-gray-100 rounded-md">Hotels</Link>
                <Link href="/flights" className="text-[#1D3557] py-2 px-3 hover:bg-gray-100 rounded-md">Flights</Link>
                <Link href="/destinations" className="text-[#1D3557] py-2 px-3 hover:bg-gray-100 rounded-md">Destinations</Link>
                <Link href="/deals" className="text-[#1D3557] py-2 px-3 hover:bg-gray-100 rounded-md">Deals</Link>
                
                {currentUser ? (
                  <>
                    <div className="text-[#1D3557] py-2 px-3">Hello, {currentUser.displayName || 'User'}</div>
                    <button 
                      onClick={handleLogout}
                      className="text-left text-primary py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-primary py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        setIsSignupModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-primary py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
