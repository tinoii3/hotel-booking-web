export interface BookingItem {
  room_name: string;
  price_per_night: number;
  nights: number;
  subtotal: number;
  adults: number;
  children: number;
}

export interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  total_price: number;
  total_nights: number;
  total_guests: number;
  status: string;
  booking_items: BookingItem[];
}