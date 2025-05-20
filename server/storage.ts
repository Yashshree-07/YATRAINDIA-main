import { 
  users, type User, type InsertUser,
  destinations, type Destination, type InsertDestination,
  hotels, type Hotel, type InsertHotel,
  flights, type Flight, type InsertFlight,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Destination methods
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Hotel methods
  getAllHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  getHotelsByCategory(category: string): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;

  // Flight methods
  getAllFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private hotels: Map<number, Hotel>;
  private flights: Map<number, Flight>;
  private bookings: Map<number, Booking>;
  
  private userCurrentId: number;
  private destinationCurrentId: number;
  private hotelCurrentId: number;
  private flightCurrentId: number;
  private bookingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.hotels = new Map();
    this.flights = new Map();
    this.bookings = new Map();
    
    this.userCurrentId = 1;
    this.destinationCurrentId = 1;
    this.hotelCurrentId = 1;
    this.flightCurrentId = 1;
    this.bookingCurrentId = 1;
    
    // Initialize with demo data
    this.initializeDestinations();
    this.initializeHotels();
    this.initializeFlights();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination methods
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.destinationCurrentId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  // Hotel methods
  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getHotelsByCategory(category: string): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(hotel => 
      hotel.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
    );
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.hotelCurrentId++;
    const hotel: Hotel = { ...insertHotel, id };
    this.hotels.set(id, hotel);
    return hotel;
  }

  // Flight methods
  async getAllFlights(): Promise<Flight[]> {
    return Array.from(this.flights.values());
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = this.flightCurrentId++;
    const flight: Flight = { ...insertFlight, id };
    this.flights.set(id, flight);
    return flight;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const booking: Booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  // Demo data initialization
  private initializeDestinations() {
    const destinationsData: InsertDestination[] = [
      {
        name: "Agra",
        description: "Home to the iconic Taj Mahal, Agra Fort, and more historic wonders",
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewCount: 2345,
        startingPrice: 2499,
      },
      {
        name: "Jaipur",
        description: "The Pink City with majestic palaces, vibrant markets, and rich culture",
        imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewCount: 3127,
        startingPrice: 3299,
      },
      {
        name: "Goa",
        description: "Paradise beaches, vibrant nightlife, and Portuguese colonial charm",
        imageUrl: "https://images.unsplash.com/photo-1580741569354-08feedd159f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewCount: 5763,
        startingPrice: 3999,
      },
      {
        name: "Varanasi",
        description: "Spiritual city on the banks of Ganges with ancient temples and ghats",
        imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewCount: 1896,
        startingPrice: 2199,
      },
      {
        name: "Udaipur",
        description: "City of Lakes with stunning palaces, temples, and romantic lakeside views",
        imageUrl: "https://images.unsplash.com/photo-1523544261223-b60f0b3663c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        rating: 4.9,
        reviewCount: 3450,
        startingPrice: 4299,
      },
      {
        name: "Kerala",
        description: "God's Own Country with serene backwaters, lush greenery and ayurvedic retreats",
        imageUrl: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewCount: 4125,
        startingPrice: 3599,
      },
      {
        name: "Darjeeling",
        description: "Misty mountains, tea plantations, and the famous toy train experience",
        imageUrl: "https://images.unsplash.com/photo-1544714042-5c0a84c2558e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewCount: 2132,
        startingPrice: 2899,
      },
      {
        name: "Amritsar",
        description: "Home to the Golden Temple, rich Punjabi culture and historic significance",
        imageUrl: "https://images.unsplash.com/photo-1518792528501-352f829886dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", 
        rating: 4.7,
        reviewCount: 1758,
        startingPrice: 2499,
      }
    ];

    destinationsData.forEach(destination => {
      this.createDestination(destination);
    });
  }

  private initializeHotels() {
    const hotelsData: InsertHotel[] = [
      {
        name: "Taj Lake Palace",
        description: "An iconic luxury hotel floating in Lake Pichola with royal heritage and breathtaking views.",
        location: "Udaipur, Rajasthan",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 9.2,
        pricePerNight: 24999,
        badge: "Popular",
        tags: ["Luxury", "Lake View", "Heritage"],
        amenities: ["Swimming Pool", "Spa", "Restaurant", "Wi-Fi", "Room Service", "Airport Shuttle"]
      },
      {
        name: "The Oberoi Amarvilas",
        description: "Luxury hotel offering unparalleled views of the Taj Mahal from every room.",
        location: "Agra, Uttar Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 9.5,
        pricePerNight: 32500,
        badge: "Taj View",
        tags: ["5-Star", "Spa", "Luxury"],
        amenities: ["Swimming Pool", "Spa", "Restaurant", "Wi-Fi", "Room Service", "Gym", "Airport Shuttle"]
      },
      {
        name: "The Leela Palace",
        description: "Opulent 5-star hotel with world-class amenities in the diplomatic enclave of Delhi.",
        location: "New Delhi",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 9.0,
        pricePerNight: 18999,
        badge: "20% Off",
        tags: ["Luxury", "Business", "Dining"],
        amenities: ["Swimming Pool", "Spa", "Restaurant", "Wi-Fi", "Room Service", "Business Center", "Gym"]
      },
      {
        name: "Taj Mahal Palace",
        description: "Historic luxury hotel overlooking the Arabian Sea, with iconic architecture and world-class service.",
        location: "Mumbai, Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 9.4,
        pricePerNight: 27999,
        badge: "Iconic",
        tags: ["Luxury", "Heritage", "Sea View"],
        amenities: ["Swimming Pool", "Spa", "Multiple Restaurants", "Wi-Fi", "Room Service", "Gym", "Concierge"]
      },
      {
        name: "Wildflower Hall",
        description: "Luxury mountain retreat set in 22 acres of virgin woods of pine and cedar with breathtaking views.",
        location: "Shimla, Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1544648138-99b4787576c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 9.1,
        pricePerNight: 21500,
        badge: "",
        tags: ["Mountain", "Luxury", "Wellness"],
        amenities: ["Indoor Pool", "Spa", "Restaurant", "Wi-Fi", "Room Service", "Adventure Activities"]
      },
      {
        name: "Kumarakom Lake Resort",
        description: "Traditional Kerala architecture meets luxury on the serene banks of Vembanad Lake.",
        location: "Kumarakom, Kerala",
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 8.9,
        pricePerNight: 15999,
        badge: "10% Off",
        tags: ["Heritage", "Beachfront", "Wellness"],
        amenities: ["Infinity Pool", "Spa", "Restaurant", "Wi-Fi", "Room Service", "Boat Tours"]
      }
    ];

    hotelsData.forEach(hotel => {
      this.createHotel(hotel);
    });
  }

  private initializeFlights() {
    const flightsData: InsertFlight[] = [
      {
        airline: "Air India",
        airlineLogo: "https://logo.clearbit.com/airindia.in",
        status: "On Time",
        departureCode: "DEL",
        departureCity: "New Delhi",
        arrivalCode: "BOM",
        arrivalCity: "Mumbai",
        duration: "1h 55m",
        stops: 0,
        price: 4249,
        departureTime: "09:15",
        arrivalTime: "11:10",
        date: "2023-07-15"
      },
      {
        airline: "IndiGo",
        airlineLogo: "https://logo.clearbit.com/goindigo.in",
        status: "On Time",
        departureCode: "BLR",
        departureCity: "Bengaluru",
        arrivalCode: "CCU",
        arrivalCity: "Kolkata",
        duration: "2h 40m",
        stops: 0,
        price: 5649,
        departureTime: "10:30",
        arrivalTime: "13:10",
        date: "2023-07-15"
      },
      {
        airline: "SpiceJet",
        airlineLogo: "https://logo.clearbit.com/spicejet.com",
        status: "10m Delay",
        departureCode: "HYD",
        departureCity: "Hyderabad",
        arrivalCode: "MAA",
        arrivalCity: "Chennai",
        duration: "1h 25m",
        stops: 0,
        price: 3799,
        departureTime: "14:15",
        arrivalTime: "15:40",
        date: "2023-07-15"
      },
      {
        airline: "Vistara",
        airlineLogo: "https://logo.clearbit.com/airvistara.com",
        status: "On Time",
        departureCode: "DEL",
        departureCity: "New Delhi",
        arrivalCode: "BLR",
        arrivalCity: "Bengaluru",
        duration: "2h 30m",
        stops: 0,
        price: 6199,
        departureTime: "08:00",
        arrivalTime: "10:30",
        date: "2023-07-15"
      },
      {
        airline: "Air India Express",
        airlineLogo: "https://logo.clearbit.com/airindiaexpress.in",
        status: "On Time",
        departureCode: "COK",
        departureCity: "Kochi",
        arrivalCode: "BOM",
        arrivalCity: "Mumbai",
        duration: "1h 45m",
        stops: 0,
        price: 4499,
        departureTime: "16:45",
        arrivalTime: "18:30",
        date: "2023-07-15"
      },
      {
        airline: "GoAir",
        airlineLogo: "https://logo.clearbit.com/goair.in",
        status: "20m Delay",
        departureCode: "BOM",
        departureCity: "Mumbai",
        arrivalCode: "JAI",
        arrivalCity: "Jaipur",
        duration: "1h 40m",
        stops: 0,
        price: 3899,
        departureTime: "12:15",
        arrivalTime: "13:55",
        date: "2023-07-15"
      }
    ];

    flightsData.forEach(flight => {
      this.createFlight(flight);
    });
  }
}

export const storage = new MemStorage();
