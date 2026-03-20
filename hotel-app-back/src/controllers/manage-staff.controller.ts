import * as staffService from '../services/manage-staff.service.js';
import { Request, Response } from 'express';

export const getStaffs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = (req.query.sortBy as string) || 'id';
        const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

        const staffs = await staffService.getStaffs(page, limit, sortBy, sortOrder);
        res.json(staffs);
    } catch (error) {
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลพนักงานได้" });
    }
};

export const getStaffName = async (_req: Request, res: Response) => {
  try {
    const name = await staffService.getAllStaffName();
    res.json(name);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error" });
  }
};

export const createStaff = async (req: Request, res: Response) => {
    try {
        const newStaff = await staffService.createStaff(req.body);
        res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", data: newStaff });
    } catch (error) {
        res.status(500).json({ message: "ไม่สามารถเพิ่มข้อมูลได้" });
    }
};

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const updatedStaff = await staffService.updateStaff(id, req.body);
        res.json({ message: "แก้ไขข้อมูลสำเร็จ", data: updatedStaff });
    } catch (error) {
        res.status(500).json({ message: "ไม่สามารถแก้ไขข้อมูลได้" });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await staffService.deleteStaff(id);
        res.json({ message: "ลบข้อมูลสำเร็จ" });
    } catch (error) {
        res.status(500).json({ message: "ไม่สามารถลบข้อมูลได้" });
    }
};