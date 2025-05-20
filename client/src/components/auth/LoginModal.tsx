import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { loginWithEmailPassword, loginWithGoogle } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await loginWithEmailPassword(email, password);
      if (result.success) {
        toast({
          title: "Login successful",
          description: "You are now logged in to your account.",
        });
        onClose();
      } else {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast({
          title: "Login successful",
          description: "You are now logged in with Google.",
        });
        onClose();
      } else {
        toast({
          title: "Google login failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogTitle className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <i className="fa-solid fa-om text-primary text-3xl mr-2"></i>
            <span className="text-[#1D3557] font-heading font-bold text-2xl">Yatra<span className="text-primary">India</span></span>
          </div>
          <h3 className="font-heading font-semibold text-2xl text-[#1D3557]">Welcome Back!</h3>
          <p className="text-gray-600 text-sm mt-1">Login to access your account</p>
        </DialogTitle>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1D3557] font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#1D3557] font-medium">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
            <a href="#" className="text-primary text-sm hover:underline">Forgot Password?</a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <span className="bg-white px-4 relative text-gray-500 text-sm">Or continue with</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
          >
            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_24dp.png" alt="Google" className="w-5 h-5 mr-2"/>
            Google
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            disabled
            className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
          >
            <i className="fa-brands fa-facebook-f text-blue-600 mr-2"></i>
            Facebook
          </Button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account? 
          <Button 
            variant="link" 
            onClick={onSwitchToSignup} 
            className="text-primary font-medium hover:underline p-0 ml-1"
          >
            Sign Up
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
