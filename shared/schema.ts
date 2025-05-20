import { pgTable, text, serial, integer, boolean, date, time, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phoneNumber: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Destination schema
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  startingPrice: integer("starting_price").notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  description: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  startingPrice: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Hotel schema
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  badge: text("badge"),
  amenities: text("amenities").array().notNull(),
  tags: text("tags").array().notNull(),
});

export const insertHotelSchema = createInsertSchema(hotels).pick({
  name: true,
  description: true,
  location: true,
  imageUrl: true,
  rating: true,
  pricePerNight: true,
  badge: true,
  amenities: true,
  tags: true,
});

export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;

// Flight schema
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  airline: text("airline").notNull(),
  airlineLogo: text("airline_logo").notNull(),
  status: text("status").notNull(),
  departureCode: text("departure_code").notNull(),
  departureCity: text("departure_city").notNull(),
  arrivalCode: text("arrival_code").notNull(),
  arrivalCity: text("arrival_city").notNull(),
  duration: text("duration").notNull(),
  stops: integer("stops").notNull(),
  price: integer("price").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  date: text("date").notNull(),
});

export const insertFlightSchema = createInsertSchema(flights).pick({
  airline: true,
  airlineLogo: true,
  status: true,
  departureCode: true,
  departureCity: true,
  arrivalCode: true,
  arrivalCity: true,
  duration: true,
  stops: true,
  price: true,
  departureTime: true,
  arrivalTime: true,
  date: true,
});

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingType: text("booking_type").notNull(), // "hotel" or "flight"
  itemId: integer("item_id").notNull(), // hotelId or flightId
  bookingDate: date("booking_date").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // null for one-way flights
  numberOfGuests: integer("number_of_guests"),
  totalPrice: integer("total_price").notNull(),
  paymentStatus: text("payment_status").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  bookingType: true,
  itemId: true,
  bookingDate: true,
  startDate: true,
  endDate: true,
  numberOfGuests: true,
  totalPrice: true,
  paymentStatus: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
