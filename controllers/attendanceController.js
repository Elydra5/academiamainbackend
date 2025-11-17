const db = require("../config/db")
const { generateInvoicePDF } = require('../middleware/billingMiddleware')

async function runDBQuery(sql,params) {
    try {
        const data = await db.query(sql,params)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
async function getAttendance(id) {
    const sql = "select * from attendance where id = ?"
    const params = [id]
    return await runDBQuery(sql,params)
}
async function getAttendances() {
    const sql = "select * from attendance"
    return await runDBQuery(sql,[])
}
async function createAttendance(data) {
    const {group_id, student_id, date, duration, teacher, receipt_id, hourly_rate} = data
    const insertSql = "insert into attendance (group_id, student_id, date, duration, teacher, receipt_id, hourly_rate) values (?,?,?,?,?,?,?)"
    const insertParams = [group_id, student_id, date, duration, teacher, receipt_id, hourly_rate]
    const insertResult = await runDBQuery(insertSql, insertParams)
    const selectSql = "SELECT * FROM attendance WHERE id = ?"
    const selectParams = [insertResult.insertId]
    const selectResult = await runDBQuery(selectSql, selectParams)
    return Array.isArray(selectResult) ? selectResult[0] : selectResult
}
async function updateAttendance(data,id) {
    const {group_id, student_id, date, duration, teacher, receipt_id, hourly_rate} = data
    const sql = "update attendance set group_id = ?, student_id = ?, date = ?, duration = ?, teacher = ?, receipt_id = ?, hourly_rate = ? where id = ?"
    const params = [group_id, student_id, date, duration, teacher, receipt_id, hourly_rate, id]
    return await runDBQuery(sql,params)
}
async function deleteAttendance(id) {
    const sql = "delete from attendance where id = ?"
    return await runDBQuery(sql,[id])
}

async function generateReceiptForAttendance(attendanceId, billingData) {
    try {
        const attendanceResult = await getAttendance(attendanceId)
        if (!attendanceResult || (Array.isArray(attendanceResult) && attendanceResult.length === 0)) {
            throw new Error('Attendance not found')
        }
        const attendance = Array.isArray(attendanceResult) ? attendanceResult[0] : attendanceResult

        if (attendance.receipt_id) {
            throw new Error('Receipt already generated for this attendance')
        }

        let hoursToBill, hourlyRateToBill

        if (billingData && billingData.hours !== undefined && billingData.hourlyRate !== undefined) {
            hoursToBill = parseFloat(billingData.hours)
            hourlyRateToBill = parseFloat(billingData.hourlyRate)
        } else {
            hoursToBill = parseFloat(attendance.duration) / 60
            hourlyRateToBill = parseFloat(attendance.hourly_rate)
        }

        if (isNaN(hoursToBill) || isNaN(hourlyRateToBill) || hoursToBill <= 0 || hourlyRateToBill <= 0) {
            throw new Error('Hours and hourly rate must be positive numbers')
        }

        const totalAmount = hoursToBill * hourlyRateToBill

        const receiptSql = "INSERT INTO generated_receipts (student_id, period_start, period_end, paid, total_amount, payment_method) VALUES (?, ?, ?, 0, ?, ?)"
        const receiptParams = [
            attendance.student_id,
            attendance.date,
            attendance.date,
            totalAmount,
            billingData?.paymentMethod || null
        ]
        const receiptResult = await runDBQuery(receiptSql, receiptParams)

        if (!receiptResult || !receiptResult.insertId) {
            throw new Error('Failed to create receipt')
        }

        const receiptId = receiptResult.insertId

        const updateSql = "UPDATE attendance SET receipt_id = ?, hourly_rate = ? WHERE id = ?"
        const updateParams = [receiptId, hourlyRateToBill, attendanceId]
        await runDBQuery(updateSql, updateParams)

        const pdfBuffer = await generateInvoicePDF({
            studentId: attendance.student_id,
            hoursStudied: hoursToBill,
            totalAmount: totalAmount
        })

        const receiptDataSql = "SELECT * FROM generated_receipts WHERE receipt_number = ?"
        const receiptData = await runDBQuery(receiptDataSql, [receiptId])

        return {
            receipt: Array.isArray(receiptData) ? receiptData[0] : receiptData,
            pdfBuffer: pdfBuffer,
            hoursBilled: hoursToBill,
            hourlyRate: hourlyRateToBill,
            totalAmount: totalAmount
        }
    } catch (error) {
        console.error('Error generating receipt:', error)
        throw error
    }
}

module.exports = {
    getAttendance,
    getAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    generateReceiptForAttendance
}