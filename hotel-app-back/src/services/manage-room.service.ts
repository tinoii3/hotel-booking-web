import * as manageRoomRepo from "../repository/manage-room.repository.js"

export const getAllRooms = async () => {
    return manageRoomRepo.roomFindAll();
}

export const getAllRoomTypes = async () => {
    return manageRoomRepo.roomTypeFindAll();
}

export const createRoom = async (data: any) => {
    return manageRoomRepo.roomCreate(data);
}

export const createRoomType = async (data: any) => {
    return manageRoomRepo.roomTypeCreate(data);
}

export const updateRoom = async (id: string, data: any) => {
    return manageRoomRepo.roomUpdate(id, data);
}

export const deleteRoom = async (id: string) => {
    return manageRoomRepo.roomDelete(id);
}