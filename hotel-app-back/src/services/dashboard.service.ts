import * as dashboardRepo from "../repository/dashboard.repository.js"

export const getDashboardSummary = async () => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        // หาข้อมูลย้อนหลัง 6 เดือน
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

        const [
            totalRooms, availableRooms, todayCheckIns, monthlyRevenue, rawRecentBookings,
            paymentsLast6Months, allBookings
        ] = await Promise.all([
            dashboardRepo.getRoomsCount(),
            dashboardRepo.getAvailableRoomsCount(),
            dashboardRepo.getTodayCheckInsCount(startOfDay, endOfDay),
            dashboardRepo.getMonthlyRevenue(startOfMonth, endOfMonth),
            dashboardRepo.getRecentBookings(5),
            dashboardRepo.getPaymentsLast6Months(sixMonthsAgo), 
            dashboardRepo.getAllValidBookings()
        ]);

        // 1. แมปข้อมูลรายการจองล่าสุด
        const recentBookings = rawRecentBookings.map((b: any) => {
            const guestName = [b.first_name, b.last_name].filter(Boolean).join(' ') || 
                              (b.users ? `${b.users.first_name || ''} ${b.users.last_name || ''}`.trim() || b.users.user_name : 'ไม่ระบุชื่อ');
            
            const firstRoomItem = b.booking_items && b.booking_items.length > 0 ? b.booking_items[0] : null;
            const roomNo = firstRoomItem?.rooms?.room_number || '-';
            const typeName = firstRoomItem?.rooms?.room_types?.name || '-';

            return {
                id: `BK${b.id.toString().padStart(3, '0')}`,
                guest: guestName || 'ไม่ระบุชื่อ',
                roomNo: roomNo,
                type: typeName,
                checkIn: b.check_in ? new Date(b.check_in).toISOString().split('T')[0] : '-',
                checkOut: b.check_out ? new Date(b.check_out).toISOString().split('T')[0] : '-', 
                status: b.status === 'checked_in' ? 'กำลังพัก' : b.status === 'pending' ? 'รอเช็คอิน' : b.status === 'cancelled' ? 'ยกเลิก' : b.status
            };
        });

        
        const revenueChartData: any = {};
        const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            revenueChartData[`${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`] = 0;
        }

        
        paymentsLast6Months.forEach((payment: any) => {
            if (!payment.created_at) return;
            const pDate = new Date(payment.created_at);
            const key = `${monthNames[pDate.getMonth()]} ${pDate.getFullYear().toString().slice(-2)}`;
            if (revenueChartData[key] !== undefined) {
                revenueChartData[key] += Number(payment.amount || 0);
            }
        });

        const revenueChart = {
            labels: Object.keys(revenueChartData),
            data: Object.values(revenueChartData)
        };

        
        const typeCount: any = {};
        let totalBooked = 0;
        
        allBookings.forEach((b: any) => {
            if (b.booking_items && Array.isArray(b.booking_items)) {
                b.booking_items.forEach((item: any) => {
                    const typeName = item.rooms?.room_types?.name || 'Unknown';
                    typeCount[typeName] = (typeCount[typeName] || 0) + 1;
                    totalBooked++;
                });
            }
        });

        const popularRooms = Object.entries(typeCount)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count]: any) => ({
                name,
                count,
                percentage: totalBooked > 0 ? Math.round((count / totalBooked) * 100) : 0
            }));

        return {
            stats: {
                totalRooms,
                availableRooms,
                todayCheckIns,
                monthlyRevenue: Number(monthlyRevenue)
            },
            recentBookings,
            revenueChart,
            popularRooms,
            topRatedRooms: []
        };
        
    } catch (error) {
        console.error("Dashboard Service Error:", error);
        throw error;
    }
}