import { prisma } from "../lib/prisma.js";

export const roomFindAll = async (
  skip: number,
  take: number,
  whereCondition: any,
  orderByCondition: any
) => {
  const [rooms, totalRooms] = await Promise.all([
    prisma.rooms.findMany({
      skip: skip,
      take: take,
      where: whereCondition,
      orderBy: orderByCondition,
      include: {
        room_types: true,
        room_images: true,
        staff: true
      },
    }),
    prisma.rooms.count({ where: whereCondition }),
  ]);

  return { rooms, totalRooms };
};

export const roomTypeFindAll = async () => {
  return prisma.room_types.findMany();
};

export const roomTypeFindWithCover = async () => {
  return prisma.room_types.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price_per_night: true,
      capacity: true,
      size_sqm: true,
      rooms: {
        select: {
          room_images: {
            where: { is_cover: true },
          },
        },
      },
    },
  });
};

export const roomCreate = async (data: any) => {
  return prisma.rooms.create({
    data: data,
  });
};

export const roomCreateMany = async (data: any) => {
  return prisma.rooms.createMany({
    data: data,
    skipDuplicates: true,
  });
};

export const roomTypeCreate = async (data: any) => {
  return prisma.room_types.create({
    data: data,
  });
};

export const roomUpdate = async (id: number, data: any) => {
  return prisma.rooms.update({
    where: { id: id },
    data: data,
  });
};

export const roomDelete = async (id: number) => {
  return prisma.rooms.delete({
    where: { id: id },
  });
};

export const countRoomsByTypeId = async (typeId: number) => {
    return prisma.rooms.count({ where: { room_type_id: typeId } });
};

export const deleteRoomType = async (id: number) => {
    return prisma.room_types.delete({ where: { id } });
};

export const getRoomImagesByRoomId = async (roomId: number) => {
  return prisma.room_images.findMany({
    where: { room_id: roomId },
  });
};

export const deleteRoomAndImagesTransaction = async (roomId: number) => {
  return prisma.$transaction([
    prisma.room_images.deleteMany({
      where: { room_id: roomId },
    }),
    prisma.rooms.delete({
      where: { id: roomId },
    }),
  ]);
};

export const roomImageCreateMany = async (imagesDate: any[]) => {
  return prisma.room_images.createMany({
    data: imagesDate,
  });
};

export const roomImageFindOne = async (imageId: number) => {
  return prisma.room_images.findUnique({
    where: { id: imageId },
  });
};

export const roomImageDelete = async (imageId: number) => {
  return prisma.room_images.delete({
    where: { id: imageId },
  });
};

export const clearRoomCover = async (roomId: number) => {
  return prisma.room_images.updateMany({
    where: { room_id: roomId },
    data: { is_cover: false },
  });
};

export const setRoomCover = async (imageId: number) => {
  return prisma.room_images.update({
    where: { id: imageId },
    data: { is_cover: true },
  });
};
