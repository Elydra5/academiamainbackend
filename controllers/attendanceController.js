const db = require("../config/db")

async function runDBQuery(sql,params) {
    try {
        data = await db.query(sql,params)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
// id, group_id, student_id, date, duration, teacher, receipt_id, hourly_rate
async function getAttendance(username) {
    sql = "select * from attendance where id = ?"
    params = [username]
    return await runDBQuery(sql,params)
}
async function getAttendances() {
    sql = "select * from attendance"
    return await runDBQuery(sql,[])
}
async function createAttendance(data) {
    const {group_id, student_id, date, duration, teacher, receipt_id, hourly_rate} = data
    sql = "insert into users (id, group_id, student_id, date, duration, teacher, receipt_id, hourly_rate) values (?,?,?,?,?,?,?,?)"
    params = [group_id, student_id, date, duration, teacher, receipt_id, hourly_rate]
    return await runDBQuery(sql,params)
}
async function updateAttendance(data,id) {
    const {group_id, student_id, date, duration, teacher, receipt_id, hourly_rate} = data
    sql = "update attendance set group_id = ?, student_id = ?, date, duration = ?, teacher = ?, receipt_id = ?, hourly_rate = ?"
    params = [group_id, student_id, date, duration, teacher, receipt_id, hourly_rate]
    return await runDBQuery(sql,params)
}
async function deleteAttendance(id) {
    sql = "delete from attendance where id = ?"
    return await runDBQuery(sql,[id])
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    createUser,
    updateUser
}