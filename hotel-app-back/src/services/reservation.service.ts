import * as reservationRepo from "../repository/reservation.repository.js"

export const getAllReservations = async (
    page: number,
    limit: number,
    roomType?: string,
    paymentStatus?: string
) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const { reservations, totalReservations } =
        await reservationRepo.reservationsFindAll(skip, take, roomType, paymentStatus);
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
