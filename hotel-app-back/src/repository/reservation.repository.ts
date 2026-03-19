import { prisma } from "../lib/prisma.js"

export const reservationFindAll = async (
  skip: number,
  take: number,
  roomType?: string,
  paymentStatus?: string
) => {
  const whereCondition = {
    ...(roomType && {
      rooms: {
        room_types: {
          name: roomType
        }
      }
    }),
    ...(paymentStatus && {
      payments: {
        some: {
          status: paymentStatus
        }
      }
    })
  };
  const [reservations, totalReservations] = await Promise.all([
    prisma.reservations.findMany({
      skip: skip,
      take: take,
      orderBy: {
        created_at: 'desc'
      },
      where: whereCondition,
      include: {
        users: true,
        rooms: {
          include: {
            room_types: true
          }
        },
        payments: true
      }
    }),
    prisma.reservations.count({
      where: whereCondition
    })
  ]);
  return { reservations, totalReservations };
}

export const roomTypeFindAll = async () => {
    return prisma.room_types.findMany();
}