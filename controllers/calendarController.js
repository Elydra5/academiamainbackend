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

async function getSchedule(startDate, endDate, groupId = null) {
    try {
        let scheduleSql = `
            SELECT 
                a.id,
                a.group_id,
                a.date,
                a.duration,
                a.teacher,
                cg.name as group_name,
                cg.short_description as group_description,
                COUNT(DISTINCT a.student_id) as student_count
            FROM attendance a
            INNER JOIN course_group cg ON a.group_id = cg.id
            WHERE a.date >= ? AND a.date <= ?
        `
        const params = [startDate, endDate]
        
        if (groupId) {
            scheduleSql += " AND a.group_id = ?"
            params.push(groupId)
        }
        
        scheduleSql += " GROUP BY a.group_id, a.date, a.duration, a.teacher ORDER BY a.date ASC, cg.name ASC"
        
        const schedule = await runDBQuery(scheduleSql, params)
        return schedule || []
    } catch (error) {
        console.error('Error getting schedule:', error)
        throw error
    }
}

async function getScheduleByGroups(startDate, endDate) {
    try {
        const scheduleSql = `
            SELECT 
                cg.id as group_id,
                cg.name as group_name,
                cg.short_description,
                a.date,
                a.duration,
                a.teacher,
                COUNT(DISTINCT a.student_id) as student_count,
                COUNT(a.id) as attendance_count
            FROM course_group cg
            INNER JOIN attendance a ON cg.id = a.group_id
            WHERE cg.status = 'active'
            AND a.date >= ? AND a.date <= ?
            GROUP BY cg.id, cg.name, cg.short_description, a.date, a.duration, a.teacher
            ORDER BY cg.name ASC, a.date ASC
        `
        const schedule = await runDBQuery(scheduleSql, [startDate, endDate])
        return schedule || []
    } catch (error) {
        console.error('Error getting schedule by groups:', error)
        throw error
    }
}

async function getEvents(startDate, endDate) {
    try {
        const events = []
        const courseStartSql = `
            SELECT 
                id,
                name,
                short_description,
                start_date,
                end_date,
                teacher,
                status
            FROM course_group
            WHERE DATE(start_date) >= ? AND DATE(start_date) <= ?
            AND status = 'active'
        `
        const courseStarts = await runDBQuery(courseStartSql, [startDate, endDate])
        
        if (courseStarts && courseStarts.length > 0) {
            courseStarts.forEach(event => {
                if (event.start_date) {
                    const eventDate = new Date(event.start_date).toISOString().split('T')[0]
                    events.push({
                        id: `course_start_${event.id}`,
                        title: `${event.name} - Kurzus kezdés`,
                        description: event.short_description,
                        date: eventDate,
                        type: 'course_start',
                        group_id: event.id,
                        group_name: event.name,
                        teacher: event.teacher
                    })
                }
            })
        }
        
        const courseEndSql = `
            SELECT 
                id,
                name,
                short_description,
                start_date,
                end_date,
                teacher,
                status
            FROM course_group
            WHERE end_date IS NOT NULL AND end_date != ''
            AND status = 'active'
        `
        const courseEnds = await runDBQuery(courseEndSql, [])
        
        if (courseEnds && courseEnds.length > 0) {
            courseEnds.forEach(event => {
                if (event.end_date) {
                    let eventDate = null
                    try {
                        if (event.end_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            eventDate = event.end_date
                        }
                        else if (event.end_date.match(/^\d{4}\. \d{2}\. \d{2}\.$/)) {
                            const parts = event.end_date.replace(/\./g, '').split(' ').filter(p => p)
                            if (parts.length >= 3) {
                                eventDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
                            }
                        }
                        
                        if (eventDate && eventDate >= startDate && eventDate <= endDate) {
                            events.push({
                                id: `course_end_${event.id}`,
                                title: `${event.name} - Kurzus vége`,
                                description: event.short_description,
                                date: eventDate,
                                type: 'course_end',
                                group_id: event.id,
                                group_name: event.name,
                                teacher: event.teacher
                            })
                        }
                    } catch (e) {
                        console.log('Error parsing end_date:', event.end_date, e)
                    }
                }
            })
        }
        
        const paymentDeadlinesSql = `
            SELECT 
                receipt_number,
                student_id,
                period_end,
                total_amount,
                paid,
                s.first_name,
                s.last_name
            FROM generated_receipts gr
            INNER JOIN student s ON gr.student_id = s.id
            WHERE gr.period_end >= ? AND gr.period_end <= ?
            AND gr.paid = 0
            ORDER BY gr.period_end ASC
        `
        const paymentDeadlines = await runDBQuery(paymentDeadlinesSql, [startDate, endDate])
        
        if (paymentDeadlines && paymentDeadlines.length > 0) {
            paymentDeadlines.forEach(payment => {
                events.push({
                    id: `payment_${payment.receipt_number}`,
                    title: `Fizetési határidő - ${payment.first_name} ${payment.last_name}`,
                    description: `Összeg: ${payment.total_amount} HUF`,
                    date: payment.period_end,
                    type: 'payment_deadline',
                    student_id: payment.student_id,
                    receipt_number: payment.receipt_number,
                    amount: parseFloat(payment.total_amount)
                })
            })
        }
        
        events.sort((a, b) => a.date.localeCompare(b.date))
        
        return events
    } catch (error) {
        console.error('Error getting events:', error)
        throw error
    }
}

async function getCalendarData(req, res) {
    try {
        const { startDate, endDate, groupId } = req.query
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters',
                message: 'startDate and endDate query parameters are required (format: YYYY-MM-DD)'
            })
        }
        
        const schedule = groupId 
            ? await getSchedule(startDate, endDate, parseInt(groupId))
            : await getScheduleByGroups(startDate, endDate)
        const events = await getEvents(startDate, endDate)
        
        res.json({
            success: true,
            data: {
                schedule: schedule,
                events: events,
                dateRange: {
                    start: startDate,
                    end: endDate
                }
            }
        })
    } catch (error) {
        console.error('Error getting calendar data:', error)
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message || 'An error occurred while fetching calendar data'
        })
    }
}

async function getMonthlyCalendar(req, res) {
    try {
        const { year, month } = req.query
        
        if (!year || !month) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters',
                message: 'year and month query parameters are required'
            })
        }
        
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
        const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
        
        const schedule = await getScheduleByGroups(startDate, endDate)
        const events = await getEvents(startDate, endDate)
        
        res.json({
            success: true,
            data: {
                schedule: schedule,
                events: events,
                month: parseInt(month),
                year: parseInt(year)
            }
        })
    } catch (error) {
        console.error('Error getting monthly calendar:', error)
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message || 'An error occurred while fetching monthly calendar data'
        })
    }
}

async function getWeeklyCalendar(req, res) {
    try {
        const { startDate } = req.query
        
        if (!startDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing parameters',
                message: 'startDate query parameter is required (format: YYYY-MM-DD)'
            })
        }
        
        const start = new Date(startDate)
        const end = new Date(start)
        end.setDate(end.getDate() + 6)
        
        const startDateStr = start.toISOString().split('T')[0]
        const endDateStr = end.toISOString().split('T')[0]
        
        const schedule = await getScheduleByGroups(startDateStr, endDateStr)
        const events = await getEvents(startDateStr, endDateStr)
        
        res.json({
            success: true,
            data: {
                schedule: schedule,
                events: events,
                weekStart: startDateStr,
                weekEnd: endDateStr
            }
        })
    } catch (error) {
        console.error('Error getting weekly calendar:', error)
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message || 'An error occurred while fetching weekly calendar data'
        })
    }
}

module.exports = {
    getCalendarData,
    getMonthlyCalendar,
    getWeeklyCalendar,
    getSchedule,
    getScheduleByGroups,
    getEvents
}

