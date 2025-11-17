const express = require('express')
const attendanceController = require("../controllers/attendanceController")

const router = express.Router()

function returnData(res,data) {
    if (data != null) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
}
function returnDataAffectedRows(res,data) {
    if (data.affectedRows == 1) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
}

router.get('/:id',async (req,res) => {
    const data = await attendanceController.getAttendance(req.params.id)
    returnData(res,data)
})
router.get('/', async (req,res) => {
    const data = await attendanceController.getAttendances()
    returnData(res,data)
})
router.post("/", async (req, res) => {
    try {
        const data = await attendanceController.createAttendance(req.body)
        returnData(res, data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create attendance' })
    }
})
router.patch("/:id", async (req,res) => {
    const data = await attendanceController.updateAttendance(req.body,req.params.id)
    returnDataAffectedRows(res,data)
})
router.delete("/:id",async (req,res) => {
    const data = await attendanceController.deleteAttendance(req.params.id)
    console.log(data)
    returnDataAffectedRows(res,data)
})
router.post("/:id/generate-receipt", async (req, res) => {
    try {
        const attendanceId = req.params.id
        const billingData = req.body

        const result = await attendanceController.generateReceiptForAttendance(attendanceId, billingData)

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="receipt_${result.receipt.receipt_number}_${Date.now()}.pdf"`)
        res.setHeader('Content-Length', result.pdfBuffer.length)
        res.setHeader('X-Receipt-Data', JSON.stringify({
            receiptNumber: result.receipt.receipt_number,
            hoursBilled: result.hoursBilled,
            hourlyRate: result.hourlyRate,
            totalAmount: result.totalAmount,
            studentId: result.receipt.student_id
        }))

        res.send(result.pdfBuffer)
    } catch (error) {
        console.error('Receipt generation error:', error)
        res.status(500).json({
            error: 'Server error',
            message: error.message || 'An error occurred while generating the receipt'
        })
    }
})

module.exports = router