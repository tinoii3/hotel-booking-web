import { prisma } from "../lib/prisma.js"

export const roomFindAll = async () => {
    return prisma.rooms.findMany();
}

export const roomTypeFindAll = async () => {
    return prisma.room_types.findMany();
}

export const roomCreate = async (data: any) => {
    return prisma.rooms.create({
        data: data
    });
}

export const roomTypeCreate = async (data: any) => {
    return prisma.room_types.create({
        data: data
    });
}

export const roomUpdate = async (id: string, data: any) => {
    return prisma.rooms.update({
        where: {id: id},
        data: data
    });
}

export const roomDelete = async (id: string) => {
    return prisma.rooms.delete({
        were: {id: id}
    });
}