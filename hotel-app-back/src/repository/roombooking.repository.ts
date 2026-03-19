import { prisma } from "../lib/prisma.js";

// ค้นหาห้องพักที่ว่างในช่วงเวลาที่กำหนด
export const findAvailableRooms = async (
  checkIn: Date,
  checkOut: Date,
  type: string | undefined,
  adults: number,
  children: number
) => {
  // สร้างเงื่อนไขการค้นหา
  const whereCondition: any = {
    status: "available",
    adults: { gte: adults },
    children: { gte: children },
    // ตรวจสอบว่าต้องไม่มีการจองในช่วงเวลาที่ทับซ้อนกัน
    booking_items: {
      none: {
        booking: {
          AND: [
            { check_in: { lt: checkOut } }, // วันที่ลูกค้าอื่นเช็คอิน ต้องน้อยกว่าวันที่เราจะเช็คเอาต์
            { check_out: { gt: checkIn } }, // วันที่ลูกค้าอื่นเช็คเอาต์ ต้องมากกว่าวันที่เราจะเช็คอิน
          ],
          status: { notIn: ["cancelled"] }, // ไม่นับการจองที่ยกเลิกไปแล้ว
        },
      },
    },
  };

  // กรองประเภทห้องถ้ามีการระบุ และไม่ได้เลือก "ทั้งหมด"
  if (type && type !== "ทั้งหมด") {
    whereCondition.room_types = { name: type };
  }

  return prisma.rooms.findMany({
    where: whereCondition,
    include: {
      room_types: true,
      room_images: {
        orderBy: { display_order: "asc" },
      },
    },
  });
};

// สร้างรายการจองใหม่ (Booking & Booking Items)
export const createBookingRecord = async (bookingData: any, itemsData: any[]) => {
  return prisma.booking.create({
    data: {
      user_id: Number(bookingData.user_id),
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      total_price: Number(bookingData.total_price),
      total_nights: Number(bookingData.total_nights),
      total_guests: Number(bookingData.total_guests),
      status: "PENDING",
      
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      note: bookingData.note,
      expires_at: bookingData.expires_at,

      booking_items: {
        create: itemsData.map((item) => ({
          room_id: Number(item.room_id),
          room_name: item.room_name,
          price_per_night: Number(item.price_per_night), 
          nights: Number(item.nights),
          subtotal: Number(item.subtotal),
          adults: Number(item.adults),
          children: Number(item.children),
        })),
      },
    },
    include: {
      booking_items: true,
    },
  });
};
export const roomFindAll = async (
  skip: number,
  take: number,
  filterType?: string,
  sortBy: string = "room_number",
  sortOrder: string = "asc",
) => {
  const whereCondition: any =
    filterType && filterType !== "all"
      ? { room_types: { name: filterType } }
      : {};

  const validSortOrder =
    sortOrder.toLocaleLowerCase() === "desc" ? "desc" : "asc";
  let orderByCondition: any = {};
  switch (sortBy) {
    case "room_type":
      orderByCondition = { room_types: { name: sortOrder } };
      break;
    case "capacity":
      orderByCondition = { room_types: { capacity: sortOrder } };
      break;
    case "staff":
      orderByCondition = { staff: { id: sortOrder } };
      break;
    default:
      orderByCondition = { [sortBy]: validSortOrder };
      break;
  }

  const [rooms, totalRooms] = await Promise.all([
    prisma.rooms.findMany({
      skip: skip,
      take: take,
      where: whereCondition,
      orderBy: orderByCondition,
      include: {
        room_types: true,
        room_images: true,
        staff: true
      },
    }),
    prisma.rooms.count({ where: whereCondition }),
  ]);

  return { rooms, totalRooms };
};