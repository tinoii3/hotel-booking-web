import { prisma } from "../lib/prisma.js"

export const reservationsFindAll = async (
  skip: number,
  take: number,
  roomType?: string,
  status?: string
) => {
  const whereCondition = {
    ...(roomType && {
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
    ...(status && {
      booking: {
        some: {
          status: status
        }
      }
    })
  };

  const [reservations, totalReservations] = await Promise.all([
    prisma.booking.findMany({
      skip,
      take,
      orderBy: {
        created_at: 'desc'
      },
      where: whereCondition,
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
}