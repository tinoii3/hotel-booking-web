import * as roombookingRepo from "../repository/roombooking.repository.js";

export const searchRooms = async (query: any) => {
    const checkIn = new Date(query.check_in);
    const checkOut = new Date(query.check_out);
    const type = query.type;
    const adults = parseInt(query.adults) || 1;
    const children = parseInt(query.children) || 0;

    if (checkIn >= checkOut) {
        throw new Error("วันที่เช็คเอาต์ (Check-out) ต้องอยู่หลังวันที่เช็คอิน (Check-in)");
    }

    const rooms = await roombookingRepo.findAvailableRooms(
        checkIn,
        checkOut,
        type,
        adults,
        children
    );

    return rooms.map((room: any) => ({
        id: room.id,
        room_number: room.room_number,
        type: room.room_types?.name,
        pricePerNight: room.room_types?.price_per_night,
        capacity: room.room_types?.capacity,
        size_sqm: room.room_types?.size_sqm,
        amenities: room.room_types?.amenities,
        maxAdults: room.adults,
        maxChildren: room.children,
        images: room.room_images.map((img: any) => img.image_path)
    }));
};

export const createBooking = async (body: any) => {
    const { user_id, check_in, check_out, first_name, last_name, email, phone, note, items } = body;

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const total_nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (total_nights <= 0) throw new Error("จำนวนคืนที่เข้าพักต้องมากกว่า 0 คืน");

    let total_price = 0;
    let total_guests = 0;

    const formattedItems = items.map((item: any) => {
        const subtotal = item.price_per_night * total_nights;
        total_price += subtotal;
        total_guests += (item.adults + item.children);
        return { ...item, nights: total_nights, subtotal: subtotal };
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const bookingData = {
        user_id,
        check_in: checkInDate,
        check_out: checkOutDate,
        total_price,
        total_nights,
        total_guests,
        first_name,
        last_name,
        email,
        phone,
        note,
        expires_at: expiresAt
    };

    return await roombookingRepo.createBookingRecord(bookingData, formattedItems);
};
export const getAllRooms = async (
    page: number,
    limit: number,
    filterType?: string,
    sortBy?: string,
    sortOrder?: string
) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const { rooms, totalRooms } = await roombookingRepo.roomFindAll(
        skip,
        take,
        filterType,
        sortBy,
        sortOrder
    );
    const totalPages = Math.ceil(totalRooms / limit);
    return {
        data: rooms,
        meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: totalRooms,
            totalPages: totalPages
        }
    }
}