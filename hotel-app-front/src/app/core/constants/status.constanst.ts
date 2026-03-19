export enum BookingStatus {
    PENDING = "รอการยืนยัน",
    CONFIRMED = "ยืนยันแล้ว",
    CANCELLED = "ยกเลิกแล้ว",
    EXPIRED = "หมดอายุ",
}

export enum PaymentStatus {
    PENDING = "รอการชำระเงิน",
    COMPLETED = "ชำระเงินแล้ว",
    FAILED = "ชำระเงินไม่สำเร็จ",
}