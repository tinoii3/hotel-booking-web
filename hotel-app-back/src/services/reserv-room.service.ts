import * as reservRoomRepo from "../repository/reserv-room.repository.js"

export const getAllReservations = async (
    page: number,
    limit: number,
    roomType?: string,
    paymentStatus?: string
) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const { reservations, totalReservations } =
        await reservRoomRepo.reservationFindAll(skip, take, roomType, paymentStatus);
    const totalPages = Math.ceil(totalReservations / limit);
    return {
        data: reservations,
        meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: totalReservations,
            totalPages: totalPages
        }
    };
}

export const getAllRoomTypes = async () => {
    return reservRoomRepo.roomTypeFindAll();
}