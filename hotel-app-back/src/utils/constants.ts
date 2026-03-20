export const ACCESS_TOKEN_EXPIRE = "15m";
export const ACCESS_TOKEN_EXPIRE_SECONDS = 15 * 60;

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum RoomStatus {
    available = "available",
    occupied = "occupied",
    maintenance = "maintenance",
    reserved = "reserved",
}