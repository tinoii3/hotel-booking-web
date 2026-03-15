import * as manageRoomRepo from "../repository/manage-room.repository.js"

export const getAllRooms = async (
    page: number,
    limit: number,
    filterType?: string,
    sortBy?: string,
    sortOrder?: string
) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const { rooms, totalRooms } = await manageRoomRepo.roomFindAll(
        skip,
        take,
        filterType,
        sortBy, 
        sortOrder
    );
    const totalPages = Math.ceil(totalRooms / limit);
    return {
        data: rooms,
        meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: totalRooms,
            totalPages: totalPages
        }
    }
}

export const getAllRoomTypes = async () => {
    return manageRoomRepo.roomTypeFindAll();
}

export const createRoom = async (data: any) => {
    return manageRoomRepo.roomCreate(data);
}

export const createManyRooms = async (data: any[]) => {
    return manageRoomRepo.roomCreateMany(data);
}

export const createRoomType = async (data: any) => {
    return manageRoomRepo.roomTypeCreate(data);
}

export const updateRoom = async (id: number, data: any) => {
    return manageRoomRepo.roomUpdate(id, data);
}

export const deleteRoom = async (id: number) => {
    return manageRoomRepo.roomDelete(id);
}