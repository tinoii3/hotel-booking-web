import * as reservationRepo from "../repository/reservation.repository.js"

export const getAllReservations = async (
  page: number,
  limit: number,
  roomType?: string,
  status?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const whereCondition: any = {
    ...(roomType && roomType !== "all" && {
      booking_items: {
        some: {
          rooms: {
            room_types: {
              name: roomType
            }
          }
        }
      }
    }),

    ...(status && status !== "all" && {
      status: status
    })
  };

  const validSortOrder =
    sortOrder?.toLowerCase() === "desc" ? "desc" : "asc";

  let orderByCondition: any = {};

  switch (sortBy) {
    case "status":
      orderByCondition = { status: validSortOrder };
      break;

    case "check_in":
      orderByCondition = { check_in: validSortOrder };
      break;

    case "check_out":
      orderByCondition = { check_out: validSortOrder };
      break;

    case "first_name":
      orderByCondition = { first_name: validSortOrder };
      break;

    default:
      orderByCondition = { created_at: "desc" };
      break;
  }

  const { reservations, totalReservations } =
    await reservationRepo.reservationsFindAll(
      skip,
      take,
      whereCondition,
      orderByCondition
    );

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
};

export const updateStatus = async (id: number, status: string) => {
  return await reservationRepo.updateReservationStatus(id, status);
};