import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MappedRoom, RoomInstance, RoomTypeApiResponse } from '../models/room-model';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  rooms: MappedRoom[] = [];

  fetchRooms() {
    this.http
      .get<RoomTypeApiResponse[]>(`${this.apiUrl}/home/room-types-with-cover`)
      .subscribe({
        next: (response) => {
          this.rooms = response.map((roomType) => {
            return {
              name: roomType.name,
              price: Number(roomType.price_per_night),
              description: roomType.description,
              image: this.extractCoverImage(roomType.rooms),
            };
          });
        },
        error: (error) => {
          console.error('Error fetching rooms:', error);
        },
      });
  }

  extractCoverImage(rooms: RoomInstance[]): string {
    for (const room of rooms) {
      const cover = room.room_images.find(img => img.is_cover);
      if (cover) {
        return cover.image_path;
      }
    }

    return 'assets/default-room.jpg'; 
  }
}
