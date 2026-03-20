import { prisma } from "../lib/prisma.js"

export const reservationsFindAll = async (
  skip: number,
  take: number,
  whereCondition: any,
  orderByCondition: any
) => {
  const [reservations, totalReservations] = await Promise.all([
    prisma.booking.findMany({
      skip,
      take,
      where: whereCondition,
      orderBy: orderByCondition,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        check_in: true,
        check_out: true,
        status: true,
        booking_items: {
          select: {
            rooms: {
              select: {
                room_number: true,
                room_types: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    }),

    prisma.booking.count({
      where: whereCondition
    })
  ]);

  return { reservations, totalReservations };
};

export const updateReservationStatus = async (
  id: number,
  status: string
) => {
  return await prisma.booking.update({
    where: { id },
    data: { status }
  });
};