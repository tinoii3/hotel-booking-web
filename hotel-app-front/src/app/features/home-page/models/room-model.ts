export interface RoomImage {
  id: number;
  image_path: string;
  is_cover: boolean;
}

export interface RoomInstance {
  room_images: RoomImage[];
}

export interface RoomTypeApiResponse {
  id: number;
  name: string;
  description: string;
  price_per_night: string;
  capacity: number;
  size_sqm: number;
  rooms: RoomInstance[];
}

export interface MappedRoom {
  name: string;
  price: number;
  description: string;
  image: string;
}