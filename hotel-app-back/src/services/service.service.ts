import * as serviceRepo from "../repository/service.repository.js";

export const getAllServices = async () => {
  return serviceRepo.findAll();
};