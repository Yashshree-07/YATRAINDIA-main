import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { loginWithGoogle, signupWithEmailPassword } from '@/lib/authUtils';
import { useToast } from '@/hooks/use-toast';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeToTerms) {
      toast({
        title: "Please agree to the terms",
        description: "You must agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await signupWithEmailPassword(email, password, firstName, lastName);
      if (result.success) {
        toast({
          title: "Account created successfully",
          description: "Welcome to YatraIndia! You are now logged in.",
        });
        onClose();
      } else {
        toast({
          title: "Signup failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast({
          title: "Signup successful",
          description: "You are now signed up with Google.",
        });
        onClose();
      } else {
        toast({
          title: "Google signup failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Google signup failed",
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
          <h3 className="font-heading font-semibold text-2xl text-[#1D3557]">Create Account</h3>
          <p className="text-gray-600 text-sm mt-1">Join us and start exploring India</p>
        </DialogTitle>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#1D3557] font-medium">First Name</Label>
              <Input 
                id="firstName" 
                type="text" 
                placeholder="First name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[#1D3557] font-medium">Last Name</Label>
              <Input 
                id="lastName" 
                type="text" 
                placeholder="Last name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
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
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#1D3557] font-medium">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
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
            onClick={handleGoogleSignup}
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
          Already have an account? 
          <Button 
            variant="link" 
            onClick={onSwitchToLogin} 
            className="text-primary font-medium hover:underline p-0 ml-1"
          >
            Login
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
