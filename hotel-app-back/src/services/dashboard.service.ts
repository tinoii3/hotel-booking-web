import * as dashboardRepo from "../repository/dashboard.repository.js"

export const getDashboardSummary = async (queryMonth?: string, queryYear?: string) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const targetYear = queryYear ? parseInt(queryYear) : today.getFullYear();
        const targetMonth = queryMonth ? parseInt(queryMonth) - 1 : today.getMonth();

        const startOfSelectedMonth = new Date(targetYear, targetMonth, 1);
        const endOfSelectedMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
        const daysInSelectedMonth = endOfSelectedMonth.getDate();

        const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29, 0, 0, 0);

        const [
            totalRooms, availableRooms, todayCheckIns, monthlyRevenue, rawRecentBookings,
            paymentsInMonth, allBookings, recentBookingsForChart 
        ] = await Promise.all([
            dashboardRepo.getRoomsCount(),
            dashboardRepo.getAvailableRoomsCount(),
            dashboardRepo.getTodayCheckInsCount(startOfDay, endOfDay),
            dashboardRepo.getMonthlyRevenue(startOfCurrentMonth, endOfCurrentMonth),
            dashboardRepo.getRecentBookings(5),
            dashboardRepo.getPaymentsByDateRange(startOfSelectedMonth, endOfSelectedMonth), 
            dashboardRepo.getAllValidBookings(),
            dashboardRepo.getBookingsForLastNDays(thirtyDaysAgo) 
        ]);

        const recentBookings = rawRecentBookings.map((b: any) => {
            const guestName = [b.first_name, b.last_name].filter(Boolean).join(' ') || 
                              (b.users ? `${b.users.first_name || ''} ${b.users.last_name || ''}`.trim() || b.users.user_name : 'ไม่ระบุชื่อ');
            
            const firstRoomItem = b.booking_items && b.booking_items.length > 0 ? b.booking_items[0] : null;
            const roomNo = firstRoomItem?.rooms?.room_number || '-';
            const typeName = firstRoomItem?.rooms?.room_types?.name || '-';

            return {
                id: `${b.id.toString().padStart(3, '0')}`,
                guest: guestName || 'ไม่ระบุชื่อ',
                roomNo: roomNo,
                type: typeName,
                checkIn: b.check_in ? new Date(b.check_in).toISOString().split('T')[0] : '-',
                checkOut: b.check_out ? new Date(b.check_out).toISOString().split('T')[0] : '-', 
                status: b.status === 'checked_in' ? 'กำลังพัก' : b.status === 'pending' ? 'รอเช็คอิน' : b.status === 'cancelled' ? 'ยกเลิก' : b.status
            };
        });

        const revenueChartData: any = {};
        for (let i = 1; i <= daysInSelectedMonth; i++) {
            revenueChartData[i.toString()] = 0; 
        }

        paymentsInMonth.forEach((payment: any) => {
            const targetDate = payment.pay_at ? new Date(payment.pay_at) : new Date(payment.created_at);
            if (!targetDate || isNaN(targetDate.getTime())) return; 

            if (targetDate.getMonth() === targetMonth && targetDate.getFullYear() === targetYear) {
                const day = targetDate.getDate().toString();
                if (revenueChartData[day] !== undefined) {
                    revenueChartData[day] += Number(payment.amount || 0);
                }
            }
        });

        const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const monthLabel = monthNames[targetMonth];

        const revenueChart = {
            labels: Object.keys(revenueChartData).map(day => `${day} ${monthLabel}`), 
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

        const dailyBookings: any[] = [];
        for (let i = 29; i >= 0; i--) { 
            const d = new Date(today); 
            d.setDate(today.getDate() - i); 

            const yearStr = d.getFullYear();
            const monthStr = String(d.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d.getDate()).padStart(2, '0');
            const localDateStr = `${yearStr}-${monthStr}-${dayStr}`;
            
            dailyBookings.push({ date: localDateStr, count: 0 });
        }

        if (recentBookingsForChart) {
            recentBookingsForChart.forEach((b: any) => {
                const bDateObj = new Date(b.created_at);
                
                const bYear = bDateObj.getFullYear();
                const bMonth = String(bDateObj.getMonth() + 1).padStart(2, '0');
                const bDay = String(bDateObj.getDate()).padStart(2, '0');
                const bDateLocalStr = `${bYear}-${bMonth}-${bDay}`;
                
                const dayRecord = dailyBookings.find(d => d.date === bDateLocalStr);
                if (dayRecord) {
                    dayRecord.count += b.booking_items ? b.booking_items.length : 1; 
                }
            });
        }

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
            dailyBookings 
        };
        
    } catch (error) {
        console.error("Dashboard Service Error:", error);
        throw error;
    }
}