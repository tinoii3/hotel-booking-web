import * as dashboardRepo from "../repository/dashboard.repository.js"

export const getDashboardSummary = async (queryMonth?: string, queryYear?: string) => {
    try {
        const now = new Date();
        const thaiOffset = 7 * 60 * 60 * 1000; 
        
        const localThaiTime = new Date(now.getTime() + thaiOffset);

        const tY = localThaiTime.getUTCFullYear();
        const tM = localThaiTime.getUTCMonth();
        const tD = localThaiTime.getUTCDate();

        const startOfDay = new Date(Date.UTC(tY, tM, tD, -7, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(tY, tM, tD, 16, 59, 59, 999));
        
        const startOfCurrentMonth = new Date(Date.UTC(tY, tM, 1, -7, 0, 0, 0));
        const endOfCurrentMonth = new Date(Date.UTC(tY, tM + 1, 0, 16, 59, 59, 999));

        const targetYear = queryYear ? parseInt(queryYear) : tY;
        const targetMonth = queryMonth ? parseInt(queryMonth) - 1 : tM;

        const startOfSelectedMonth = new Date(Date.UTC(targetYear, targetMonth, 1, -7, 0, 0, 0));
        const endOfSelectedMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 16, 59, 59, 999));
        const daysInSelectedMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();

        const thirtyDaysAgo = new Date(Date.UTC(tY, tM, tD - 29, -7, 0, 0, 0));

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
            
            let roomNos: string[] = [];
            let roomTypes: string[] = [];

            if (b.booking_items && b.booking_items.length > 0) {
                b.booking_items.forEach((item: any) => {
                    if (item.rooms) {
                        if (item.rooms.room_number) roomNos.push(item.rooms.room_number);
                        if (item.rooms.room_types && item.rooms.room_types.name) {
                            if (!roomTypes.includes(item.rooms.room_types.name)) {
                                roomTypes.push(item.rooms.room_types.name);
                            }
                        }
                    }
                });
            }

            const displayRoomNo = roomNos.length > 0 ? roomNos.join(', ') : '-';
            const displayRoomType = roomTypes.length > 0 ? roomTypes.join(', ') : '-';

            let checkInDate = '-';
            if (b.check_in) {
                const cIn = new Date(new Date(b.check_in).getTime() + (7 * 60 * 60 * 1000)); 
                checkInDate = cIn.toISOString().split('T')[0];
            }

            let checkOutDate = '-';
            if (b.check_out) {
                const cOut = new Date(new Date(b.check_out).getTime() + (7 * 60 * 60 * 1000));
                checkOutDate = cOut.toISOString().split('T')[0];
            }

            return {
                id: `${b.id.toString().padStart(3, '0')}`,
                guest: guestName || 'ไม่ระบุชื่อ',
                roomNo: displayRoomNo,    
                type: displayRoomType,    
                checkIn: checkInDate,
                checkOut: checkOutDate, 
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

            const pThaiTime = new Date(targetDate.getTime() + thaiOffset);

            if (pThaiTime.getUTCMonth() === targetMonth && pThaiTime.getUTCFullYear() === targetYear) {
                const day = pThaiTime.getUTCDate().toString();
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
            const d = new Date(Date.UTC(tY, tM, tD - i)); 

            const yearStr = d.getUTCFullYear();
            const monthStr = String(d.getUTCMonth() + 1).padStart(2, '0');
            const dayStr = String(d.getUTCDate()).padStart(2, '0');
            const localDateStr = `${yearStr}-${monthStr}-${dayStr}`;
            
            dailyBookings.push({ date: localDateStr, count: 0 });
        }

        if (recentBookingsForChart) {
            recentBookingsForChart.forEach((b: any) => {
                if (!b.check_in) return; 

                const bDateObj = new Date(b.check_in);
                const bThaiTime = new Date(bDateObj.getTime() + thaiOffset);
                
                const bYear = bThaiTime.getUTCFullYear();
                const bMonth = String(bThaiTime.getUTCMonth() + 1).padStart(2, '0');
                const bDay = String(bThaiTime.getUTCDate()).padStart(2, '0');
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