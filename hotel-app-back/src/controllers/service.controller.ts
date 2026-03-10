import { type Request, type Response } from "express";
import * as serviceService from "../services/service.service.js";

export const getService = async (_req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices();
    res.json(services); 
  } catch (error) {
    console.error(error)
    res.status(500).json({ mesage: "Database error" });
  }
};