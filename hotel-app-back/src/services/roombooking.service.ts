import * as roombookingRepo from "../repository/roombooking.repository.js";

export const processSearchRooms = async (query: any) => {
    const adults = Number(query.adults);
    const children = Number(query.children);
    const roomType = query.room_type;
    const whereCondition: any = {
        adults: { lte: adults },
        children: { lte: children },
        status: 'available',
    };

    if (roomType && roomType !== 'all') {
        whereCondition.room_type_id = Number(roomType);
    }

    const availableRooms = await roombookingRepo.searchAvailableRooms(whereCondition);

    return {
        message: "ค้นหาห้องว่างสำเร็จ",
        total_found: availableRooms.length,
        data: availableRooms
    };
};

export const upsertBooking = async (body: any) => {
    const { user_id, check_in, check_out, first_name, last_name, email, phone, note, items } = body;

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const total_nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (total_nights <= 0) throw new Error("จำนวนคืนที่เข้าพักต้องมากกว่า 0 คืน");

    let total_prices = 0;
    let total_guests = 0;

    const formattedItems = items.map((item: any) => {
        const subtotal = item.price_per_night * total_nights;
        total_prices += subtotal;
        total_guests += (item.adults + item.children);
        return { ...item, nights: total_nights, subtotal: subtotal };
    });

    const expiresAt = new Date();
    // expiresAt.setHours(expiresAt.getHours() + 10);
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const bookingData = {
        user_id,
        check_in: checkInDate,
        check_out: checkOutDate,
        total_price: total_prices,
        total_nights,
        total_guests,
        first_name,
        last_name,
        email,
        phone,
        note,
        expires_at: expiresAt
    };

    return await roombookingRepo.upsertBooking(bookingData, formattedItems);
};