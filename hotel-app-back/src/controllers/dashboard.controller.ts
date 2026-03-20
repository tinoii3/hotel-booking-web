import { type Request, type Response } from "express"
import * as dashboardService from "../services/dashboard.service.js"

// 💡 1. เอาขีดล่างหน้า _req ออก เพื่อให้ใช้งาน req ได้
export const getSummary = async (req: Request, res: Response) => {
    try {
        // 💡 2. ดึงค่า month กับ year ที่หน้าบ้านส่งมาผ่าน query string
        const month = req.query.month as string;
        const year = req.query.year as string;

        // 💡 3. ส่งค่าที่ดึงมา โยนต่อไปให้ฟังก์ชัน getDashboardSummary
        const summary = await dashboardService.getDashboardSummary(month, year);
        
        res.json({ data: summary });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
}