import path from "path";
import fs from 'fs';
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

export const saveRoomImages = async (roomId: number, files: Express.Multer.File[], coverIndex: number) => {
    if (coverIndex >= 0) {
        await manageRoomRepo.clearRoomCover(roomId);
    }
    const imagesData = files.map((file, index) => ({
        room_id: roomId,
        image_path: `/uploads/rooms/${file.filename}`,
        is_cover: index === coverIndex,
        display_order: index
    }));
    return manageRoomRepo.roomImageCreateMany(imagesData);
}

export const deleteRoomImage = async (imageId: number) => {
    const image = await manageRoomRepo.roomImageFindOne(imageId);
    if (!image) throw new Error("ไม่พบรูปภาพนี้ในระบบ");
    const filePath = path.join(process.cwd(), 'src', 'assets', image.image_path);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    return manageRoomRepo.roomImageDelete(imageId);
}

export const updateCoverImage = async (roomId: number, imageId: number) => {
    await manageRoomRepo.clearRoomCover(roomId);
    return manageRoomRepo.setRoomCover(imageId);
}

export const deleteRoomWithImages = async (roomId: number) => {
    const images = await manageRoomRepo.getRoomImagesByRoomId(roomId);
    for (const img of images) {
        if (img.image_path) {
            const filePath = path.join(process.cwd(), 'src', 'assets', img.image_path);

            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.warn(`[Warning] ไม่พบไฟล์ หรือลบไม่ได้ข้ามไป: ${filePath}`);
            }
        }
    }
    return manageRoomRepo.deleteRoomAndImagesTransaction(roomId);
};