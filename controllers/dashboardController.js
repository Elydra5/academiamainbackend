const db = require("../config/db")

async function runDBQuery(sql, params) {
    try {
        const data = await db.query(sql, params)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

async function getDashboardStats() {
    try {
        const studentsCountSql = "SELECT COUNT(*) as count FROM student"
        const studentsCount = await runDBQuery(studentsCountSql, [])

        const activeGroupsSql = "SELECT COUNT(*) as count FROM course_group WHERE status = 'active'"
        const activeGroups = await runDBQuery(activeGroupsSql, [])

        const today = new Date().toISOString().split('T')[0]
        const todayAttendanceSql = "SELECT COUNT(*) as count FROM attendance WHERE date = ?"
        const todayAttendance = await runDBQuery(todayAttendanceSql, [today])

        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const monthlyRevenueSql = `
            SELECT COALESCE(SUM(total_amount), 0) as revenue 
            FROM generated_receipts 
            WHERE MONTH(period_start) = ? AND YEAR(period_start) = ? AND paid = 1
        `
        const monthlyRevenue = await runDBQuery(monthlyRevenueSql, [currentMonth, currentYear])

        return {
            studentsCount: studentsCount && studentsCount[0] ? studentsCount[0].count : 0,
            activeGroups: activeGroups && activeGroups[0] ? activeGroups[0].count : 0,
            todayAttendance: todayAttendance && todayAttendance[0] ? todayAttendance[0].count : 0,
            monthlyRevenue: monthlyRevenue && monthlyRevenue[0] ? parseFloat(monthlyRevenue[0].revenue) : 0
        }
    } catch (error) {
        console.error('Error getting dashboard stats:', error)
        throw error
    }
}

async function getAttendanceTrends() {
    try {
        const trendsSql = `
            SELECT 
                date,
                COUNT(*) as attendance_count
            FROM attendance
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY date
            ORDER BY date ASC
        `
        const trends = await runDBQuery(trendsSql, [])
        return trends || []
    } catch (error) {
        console.error('Error getting attendance trends:', error)
        throw error
    }
}

async function getGroupDistribution() {
    try {
        const distributionSql = `
            SELECT 
                cg.id,
                cg.name,
                COUNT(DISTINCT e.student_id) as student_count,
                COUNT(a.id) as attendance_count
            FROM course_group cg
            LEFT JOIN enrollments e ON cg.id = e.group_id
            LEFT JOIN attendance a ON cg.id = a.group_id
            WHERE cg.status = 'active'
            GROUP BY cg.id, cg.name
            ORDER BY student_count DESC
        `
        const distribution = await runDBQuery(distributionSql, [])
        return distribution || []
    } catch (error) {
        console.error('Error getting group distribution:', error)
        throw error
    }
}

async function getMonthlyBilling() {
    try {
        const billingSql = `
            SELECT 
                DATE_FORMAT(period_start, '%Y-%m') as month,
                SUM(total_amount) as total_revenue,
                COUNT(*) as receipt_count
            FROM generated_receipts
            WHERE period_start >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND paid = 1
            GROUP BY DATE_FORMAT(period_start, '%Y-%m')
            ORDER BY month ASC
        `
        const billing = await runDBQuery(billingSql, [])
        return billing || []
    } catch (error) {
        console.error('Error getting monthly billing:', error)
        throw error
    }
}

async function getAllDashboardData(req, res) {
    try {
        const stats = await getDashboardStats()
        const attendanceTrends = await getAttendanceTrends()
        const groupDistribution = await getGroupDistribution()
        const monthlyBilling = await getMonthlyBilling()

        res.json({
            success: true,
            data: {
                summaryCards: stats,
                attendanceTrends: attendanceTrends,
                groupDistribution: groupDistribution,
                monthlyBilling: monthlyBilling
            }
        })
    } catch (error) {
        console.error('Error getting dashboard data:', error)
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message || 'An error occurred while fetching dashboard data'
        })
    }
}

module.exports = {
    getAllDashboardData,
    getDashboardStats,
    getAttendanceTrends,
    getGroupDistribution,
    getMonthlyBilling
}

