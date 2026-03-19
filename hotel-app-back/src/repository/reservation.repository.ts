import { prisma } from "../lib/prisma.js"

// export const reservationFindAll = async (
//   skip: number,
//   take: number,
//   roomType?: string,
//   paymentStatus?: string
// ) => {
//   const whereCondition = {
//     ...(roomType && {
//       rooms: {
//         room_types: {
//           name: roomType
//         }
//       }
//     }),
//     ...(paymentStatus && {
//       payments: {
//         some: {
//           status: paymentStatus
//         }
//       }
//     })
//   };
//   const [reservations, totalReservations] = await Promise.all([
//     prisma.reservations.findMany({
//       skip: skip,
//       take: take,
//       orderBy: {
//         created_at: 'desc'
//       },
//       where: whereCondition,
//       include: {
//         users: true,
//         rooms: {
//           include: {
//             room_types: true
//           }
//         },
//         payments: true
//       }
//     }),
//     prisma.reservations.count({
//       where: whereCondition
//     })
//   ]);
//   return { reservations, totalReservations };
// }

export const reservationsFindAll = async (
  skip: number,
  take: number,
  roomType?: string,
  paymentStatus?: string
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
    ...(paymentStatus && {
      payments: {
        some: {
          status: paymentStatus
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
        },

        payments: {
          select: {
            status: true
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