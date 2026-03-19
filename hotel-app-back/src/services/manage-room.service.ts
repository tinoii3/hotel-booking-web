import path from "path";
import fs from 'fs';
import * as manageRoomRepo from "../repository/manage-room.repository.js";
import * as uploadService from "../services/upload.service.js";

export const getAllRooms = async (
    page: number,
    limit: number,
    filterType?: string,
    sortBy?: string,
    sortOrder?: string
) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const whereCondition: any =
        filterType && filterType !== "all"
            ? { room_types: { name: filterType } }
            : {};

    const validSortOrder = sortOrder?.toLocaleLowerCase() === "desc" ? "desc" : "asc";
    let orderByCondition: any = {};
    switch (sortBy) {
        case "room_type":
            orderByCondition = { room_types: { name: sortOrder } };
            break;
        case "capacity":
            orderByCondition = { room_types: { capacity: sortOrder } };
            break;
        case "staff":
            orderByCondition = { staff: { id: sortOrder } };
            break;
        default:
            orderByCondition = { [String(sortBy)]: validSortOrder };
            break;
    }

    const { rooms, totalRooms } = await manageRoomRepo.roomFindAll(
        skip,
        take,
        whereCondition,
        orderByCondition
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

export const getAllRoomTypesWithCover = async () => {
    return manageRoomRepo.roomTypeFindWithCover();
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

export const removeRoomType = async (id: number) => {
    const roomCount = await manageRoomRepo.countRoomsByTypeId(id);
    if (roomCount > 0) {
        throw new Error(`ไม่สามารถลบได้ เนื่องจากมีห้องพักจำนวน ${roomCount} ห้องกำลังใช้ประเภทนี้อยู่`);
    }
    return manageRoomRepo.deleteRoomType(id);
};

export const saveRoomImages = async (roomId: number, files: Express.Multer.File[], coverIndex: number) => {
    if (coverIndex >= 0) {
        await manageRoomRepo.clearRoomCover(roomId);
    }
    const uploadResults = await Promise.all(files.map((file) => uploadService.uploadToCloudinary(file.buffer)));
    const imagesData = uploadResults.map((result, index) => ({
        room_id: roomId,
        image_path: result.secure_url,
        is_cover: index === coverIndex,
        display_order: index,
        publicId: result.public_id,
    }));

    return manageRoomRepo.roomImageCreateMany(imagesData);
}

export const deleteRoomImage = async (imageId: number) => {
    const image = await manageRoomRepo.roomImageFindOne(imageId);
    if (!image) throw new Error("ไม่พบรูปภาพนี้ในระบบ");
    const filePath = path.join(process.cwd(), 'assets', image.image_path);
    if (image.image_path) {
        try {
            const matches = image.image_path.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);

            if (matches && matches[1]) {
                const publicId = matches[1];
                console.log('กำลังลบรูปจาก Cloudinary, Public ID:', publicId);
                await uploadService.deleteFromCloudinary(publicId);
                console.log('ลบรูปจาก Cloudinary สำเร็จ!');
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบรูปจาก Cloudinary:", error);
        }
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
            const filePath = path.join(process.cwd(), 'assets', img.image_path);

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