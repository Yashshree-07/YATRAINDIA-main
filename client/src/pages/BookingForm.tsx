import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Hotel, Flight } from '@shared/schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, User, Phone, Loader2 } from "lucide-react";

// Define booking schema
const bookingFormSchema = z.object({
  contactName: z.string().min(3, "Name must be at least 3 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  startDate: z.date({
    required_error: "Please select a check-in date",
  }),
  endDate: z.date({
    required_error: "Please select a check-out date",
  }).optional().nullable(),
  numberOfGuests: z.string().min(1, "Please select number of guests"),
  paymentMethod: z.string({
    required_error: "Please select a payment method",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const { type, id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [item, setItem] = useState<Hotel | Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalNights, setTotalNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      contactName: currentUser?.displayName || "",
      contactEmail: currentUser?.email || "",
      contactPhone: "",
      startDate: new Date(),
      endDate: type === 'hotel' ? new Date(new Date().setDate(new Date().getDate() + 1)) : null,
      numberOfGuests: "1",
      paymentMethod: "credit-card",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to book hotels or flights.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'hotel' ? `/api/hotels/${id}` : `/api/flights/${id}`;
        const response = await apiRequest('GET', endpoint, undefined);
        const data = await response.json();
        setItem(data);
        
        // Initialize price based on item type
        if (type === 'hotel') {
          setTotalPrice(data.pricePerNight);
        } else {
          setTotalPrice(data.price);
        }
        
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${type} details. Please try again.`,
          variant: "destructive",
        });
        setLoading(false);
        navigate(`/${type}s`);
      }
    };

    fetchItem();
  }, [type, id, currentUser, navigate, toast]);

  // Watch for date changes to calculate total nights and price for hotels
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  
  useEffect(() => {
    if (type === 'hotel' && startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalNights(diffDays);
      setTotalPrice((item as Hotel).pricePerNight * diffDays);
    }
  }, [startDate, endDate, type, item]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!currentUser || !item) return;
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        userId: parseInt(currentUser.uid.substring(0, 5)), // Using substring of UID as mock ID
        bookingType: type,
        itemId: parseInt(id),
        bookingDate: new Date(),
        startDate: data.startDate,
        endDate: data.endDate || null,
        numberOfGuests: parseInt(data.numberOfGuests),
        totalPrice,
        paymentStatus: "confirmed",
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      };

      await apiRequest('POST', '/api/bookings', bookingData);
      
      toast({
        title: "Booking confirmed!",
        description: `Your ${type} has been successfully booked.`,
      });
      
      setIsSubmitting(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#1D3557]">Loading booking information...</h3>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-[#1D3557]">Item not found</h3>
          <p className="text-gray-600 mt-2">The requested {type} could not be found.</p>
          <Button onClick={() => navigate(`/${type}s`)} className="mt-4">
            Go back to {type}s
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">
            {type === 'hotel' ? 'Hotel Booking' : 'Flight Booking'}
          </h1>
          <p className="text-[#457B9D]">Complete your booking details below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
                <CardDescription>
                  Please fill in your details to complete the booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-[#1D3557]">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="John Doe" {...field} className="pl-10" />
                                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="+91 98765 43210" {...field} className="pl-10" />
                                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium text-[#1D3557]">Booking Details</h3>
                      
                      {type === 'hotel' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Check-in Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className="pl-3 text-left font-normal"
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Check-out Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className="pl-3 text-left font-normal"
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date <= startDate || date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="numberOfGuests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Guests</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select number of guests" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">1 Guest</SelectItem>
                                    <SelectItem value="2">2 Guests</SelectItem>
                                    <SelectItem value="3">3 Guests</SelectItem>
                                    <SelectItem value="4">4 Guests</SelectItem>
                                    <SelectItem value="5">5 Guests</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Departure Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className="pl-3 text-left font-normal"
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="numberOfGuests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Passengers</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select number of passengers" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">1 Passenger</SelectItem>
                                    <SelectItem value="2">2 Passengers</SelectItem>
                                    <SelectItem value="3">3 Passengers</SelectItem>
                                    <SelectItem value="4">4 Passengers</SelectItem>
                                    <SelectItem value="5">5 Passengers</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium text-[#1D3557]">Payment Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                <SelectItem value="debit-card">Debit Card</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="net-banking">Net Banking</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Complete Booking
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {type === 'hotel' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={(item as Hotel).imageUrl} 
                        alt={(item as Hotel).name} 
                        className="h-20 w-20 object-cover rounded-md" 
                      />
                      <div>
                        <h3 className="font-medium text-[#1D3557]">{(item as Hotel).name}</h3>
                        <p className="text-sm text-gray-500">{(item as Hotel).location}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{startDate ? format(startDate, "PPP") : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{endDate ? format(endDate, "PPP") : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{totalNights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{form.watch("numberOfGuests")}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per night:</span>
                        <span className="font-medium">₹{(item as Hotel).pricePerNight.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total nights:</span>
                        <span className="font-medium">{totalNights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & fees:</span>
                        <span className="font-medium">Included</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-[#1D3557]">Total Amount:</span>
                      <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={(item as Flight).airlineLogo} 
                        alt={(item as Flight).airline} 
                        className="h-10 w-10 object-contain" 
                      />
                      <div>
                        <h3 className="font-medium text-[#1D3557]">{(item as Flight).airline}</h3>
                        <p className="text-sm text-gray-500">Flight #{id}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="block text-xl font-bold text-[#1D3557]">{(item as Flight).departureCode}</span>
                          <span className="text-sm text-gray-500">{(item as Flight).departureCity}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-sm text-gray-500">{(item as Flight).duration}</span>
                          <div className="w-24 h-px bg-gray-300 relative my-1">
                            <div className="absolute w-2 h-2 bg-primary rounded-full -top-0.5 -left-1"></div>
                            <div className="absolute w-2 h-2 bg-primary rounded-full -top-0.5 -right-1"></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {(item as Flight).stops === 0 
                              ? 'Non-stop' 
                              : `${(item as Flight).stops} stop${(item as Flight).stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xl font-bold text-[#1D3557]">{(item as Flight).arrivalCode}</span>
                          <span className="text-sm text-gray-500">{(item as Flight).arrivalCity}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-500 block">Departure</span>
                          <span className="font-medium">{(item as Flight).departureTime}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 block">Arrival</span>
                          <span className="font-medium">{(item as Flight).arrivalTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{startDate ? format(startDate, "PPP") : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passengers:</span>
                        <span className="font-medium">{form.watch("numberOfGuests")}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base fare:</span>
                        <span className="font-medium">₹{(item as Flight).price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & fees:</span>
                        <span className="font-medium">Included</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-[#1D3557]">Total Amount:</span>
                      <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a demonstration booking. No actual charges will be made.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="text-xs text-gray-500 space-y-1 w-full">
                  <p>By proceeding with this booking, you agree to our Terms of Service and Privacy Policy.</p>
                  <p>For any assistance, contact our customer support at +91 1234 567890.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
