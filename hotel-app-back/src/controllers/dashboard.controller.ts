import { type Request, type Response } from "express"
import * as dashboardService from "../services/dashboard.service.js"


export const getSummary = async (req: Request, res: Response) => {
    try {

        const month = req.query.month as string;
        const year = req.query.year as string;

        const summary = await dashboardService.getDashboardSummary(month, year);
        
        res.json({ data: summary });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
}