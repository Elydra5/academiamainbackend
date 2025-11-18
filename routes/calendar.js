const express = require('express')
const calendarController = require('../controllers/calendarController')

const router = express.Router()

router.get('/', calendarController.getCalendarData)

router.get('/month', calendarController.getMonthlyCalendar)

router.get('/week', calendarController.getWeeklyCalendar)

router.get('/schedule', async (req, res) => {
    try {
        const { startDate, endDate, groupId } = req.query
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters',
                message: 'startDate and endDate query parameters are required'
            })
        }
        
        const schedule = await calendarController.getSchedule(
            startDate, 
            endDate, 
            groupId ? parseInt(groupId) : null
        )
        res.json({ success: true, data: schedule })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

router.get('/events', async (req, res) => {
    try {
        const { startDate, endDate } = req.query
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters',
                message: 'startDate and endDate query parameters are required'
            })
        }
        
        const events = await calendarController.getEvents(startDate, endDate)
        res.json({ success: true, data: events })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

module.exports = router

