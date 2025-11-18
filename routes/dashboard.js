const express = require('express')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router()

router.get('/', dashboardController.getAllDashboardData)

router.get('/stats', async (req, res) => {
    try {
        const stats = await dashboardController.getDashboardStats()
        res.json({ success: true, data: stats })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

router.get('/attendance-trends', async (req, res) => {
    try {
        const trends = await dashboardController.getAttendanceTrends()
        res.json({ success: true, data: trends })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

router.get('/group-distribution', async (req, res) => {
    try {
        const distribution = await dashboardController.getGroupDistribution()
        res.json({ success: true, data: distribution })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

router.get('/monthly-billing', async (req, res) => {
    try {
        const billing = await dashboardController.getMonthlyBilling()
        res.json({ success: true, data: billing })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

module.exports = router

