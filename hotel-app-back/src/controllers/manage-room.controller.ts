import { type Request, type Response } from "express"
import * as manageRoomService from "../services/manage-room.service.js"

export const getRooms = async (_req: Request, res: Response) => {
    try {
        const room = await manageRoomService.getAllRooms();
        res.json(room);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mesage: "Database error" });
    }
}

export const getRoomTypes = async (_req: Request, res: Response) => {
    try {
        const types = await manageRoomService.getAllRoomTypes();
        res.json(types);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Database error" });
    }
}

export const createRoom = async (req: Request, res: Response) => {
    try {
        const roomData = req.body;
        const newRoom = await manageRoomService.createRoom(roomData);
        res.status(201).json(newRoom);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create room" });
    }
}

export const createRoomType = async (req: Request, res: Response) => {
    try {
        const typeDate = req.body;
        const newType = await manageRoomService.createRoomType(typeDate);
        res.status(201).json(newType);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create room type" });
    }
}

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const roomData = req.body;
        const updateRoom = await manageRoomService.updateRoom(id, roomData);
        res.json(updateRoom);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update room" });
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await manageRoomService.deleteRoom(id);
        res.json({ message: "Room delete successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete room"});
    }
}