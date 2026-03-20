import { prisma } from "../lib/prisma.js"

export const getRoomsCount = async () => prisma.rooms.count();

export const getAvailableRoomsCount = async () => prisma.rooms.count({ where: { status: 'available' } });

export const getTodayCheckInsCount = async (startOfDay: Date, endOfDay: Date) => {
    return prisma.booking.count({
        where: { 
            check_in: { gte: startOfDay, lte: endOfDay },
            status: 'CONFIRMED' 
        },
    });
}

export const getMonthlyRevenue = async (startOfMonth: Date, endOfMonth: Date) => {
    const result = await prisma.payments.aggregate({
        _sum: { amount: true },
        where: { 
            status: 'COMPLETED', 
            created_at: { gte: startOfMonth, lte: endOfMonth }  
        }
    });
    return result._sum.amount || 0;
}

export const getRecentBookings = async (limit: number) => {
    return prisma.booking.findMany({
        take: limit,
        where: {
            status: 'CONFIRMED'
        },
        orderBy: { created_at: 'desc' },
        include: { 
            users: true, 
            booking_items: { 
                include: { rooms: { include: { room_types: true } } } 
            } 
        }
    });
}

export const getBookingsForLastNDays = async (startDate: Date) => {
    return prisma.booking.findMany({
        where: {
            status: 'CONFIRMED', 
            check_in: { gte: startDate }
        },
        select: {
            check_in: true, 
            booking_items: { select: { id: true } } 
        }
    });
}

export const getPaymentsByDateRange = async (startDate: Date, endDate: Date) => {
    return prisma.payments.findMany({
        where: { 
            status: { in: ['COMPLETED', 'completed', 'paid', 'success'] }, 
            created_at: { gte: startDate, lte: endDate } 
        },
        select: { amount: true, pay_at: true, created_at: true }
    });
}

export const getAllValidBookings = async () => {
    return prisma.booking.findMany({
        where: { status: { notIn: ['cancelled'] } },
        include: { 
            booking_items: { 
                include: { rooms: { include: { room_types: true } } } 
            } 
        }
    });
}