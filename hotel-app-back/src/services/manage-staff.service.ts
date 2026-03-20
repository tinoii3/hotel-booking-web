import * as staffRepo from '../repository/manage-staff.repository.js';

export const getStaffs = async (page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc') => {
    const skip = (page - 1) * limit;
    const result = await staffRepo.findAll(skip, limit, sortBy, sortOrder);
    return {
        data: result.data,
        meta: {
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total
        }
    };
};

export const getAllStaffName = async () => {
    return staffRepo.findName();
}

export const createStaff = async (data: any) => {
    return staffRepo.create(data);
};

export const updateStaff = async (id: number, data: any) => {
    return staffRepo.update(id, data);
};

export const deleteStaff = async (id: number) => {
    return staffRepo.remove(id);
};