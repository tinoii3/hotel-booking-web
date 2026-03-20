import { type Request, type Response } from "express"
import * as dashboardService from "../services/dashboard.service.js"

export const getSummary = async (_req: Request, res: Response) => {
    try {
        const summary = await dashboardService.getDashboardSummary();
        res.json({ data: summary });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
}