import { prisma } from "../lib/prisma.js";

export const findAll = async (skip: number, take: number, sortBy: string, sortOrder: 'asc' | 'desc') => {
    const [data, total] = await Promise.all([
        prisma.staff.findMany({
            skip,
            take,
            orderBy: { [sortBy]: sortOrder }
        }),
        prisma.staff.count()
    ]);
    return { data, total };
};

export const findName = async () => {
  return prisma.staff.findMany({
    where: {
      is_active: true 
    },
    select: {
      id: true,
      staff_name: true
    },
    orderBy: {
      staff_name: 'asc' 
    }
  });
};

export const findById = async (id: number) => {
    return prisma.staff.findUnique({ where: { id } });
};

export const create = async (data: any) => {
    return prisma.staff.create({ data });
};

export const update = async (id: number, data: any) => {
    return prisma.staff.update({ where: { id }, data });
};

export const remove = async (id: number) => {
    return prisma.staff.delete({ where: { id } });
};