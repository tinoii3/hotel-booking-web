import { prisma } from "../lib/prisma.js"

export const roomFindAll = async (skip: number, take: number) => {
    const [rooms, totalRooms] = await Promise.all([
        prisma.rooms.findMany({
            skip: skip,
            take: take,
            orderBy: { room_number: 'asc' },
            include: { 
                room_types: true
            }
        }),
        prisma.rooms.count()
    ]);

    return { rooms, totalRooms };
}

export const roomTypeFindAll = async () => {
    return prisma.room_types.findMany();
}

export const roomCreate = async (data: any) => {
    return prisma.rooms.create({
        data: data
    });
}

export const roomCreateMany = async (data: any) => {
    return prisma.rooms.createMany({
        data: data,
        skipDuplicates: true
    });
}

export const roomTypeCreate = async (data: any) => {
    return prisma.room_types.create({
        data: data
    });
}

export const roomUpdate = async (id: number, data: any) => {
    return prisma.rooms.update({
        where: { id: id },
        data: data
    });
}

export const roomDelete = async (id: number) => {
    return prisma.rooms.delete({
        where: { id: id }
    });
}