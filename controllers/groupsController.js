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

async function getGroup(id) {
    sql = "select * from course_group where id = ?"
    params = [id]
    const groupInfo =  await runDBQuery(sql,params)
    sql = "select * from enrollments where group_id = ?"
    params = [groupInfo[0].id]
    const studentIds = await runDBQuery(sql,params)
    sql = "select * from students where id in ("
}
async function getGroups() {
    sql = "select id, name from course_group"
    return await runDBQuery(sql,[])
}
async function createGroup(data) {
    const {name,short_description,moodle_id,end_date,teacher,long_description} = data
    sql = "insert into course_group (name, short_description, moodle_id, end_date, teacher, long_description) values (?,?,?,?,?,?)"
    params = [name,short_description,moodle_id,end_date,teacher,long_description]
    return await runDBQuery(sql,params)
}
async function updateGroup(data,id) {
    const {name,short_description,moodle_id,start_date,end_date,status,teacher,long_description} = data
    sql = "update course_group set name = ?, short_description = ?, moodle_id = ?, start_date = ?, end_date = ?, status = ?, teacher = ?, long_description = ?"
    params = [name,short_description,moodle_id,start_date,end_date,status,teacher,long_description]
    return await runDBQuery(sql,params)
}
async function deleteGroup(id) {
    sql = "delete from course_groups where id = ?"
    return await runDBQuery(sql,[id])
}
async function enroll(data) {
    const {group_id,student_id} = data
    sql  = "insert into enrollments (student_id, group_id) values (?,?)"
    params = [student_id,group_id]
    return await runDBQuery(sql,params)
}
async function undoEnroll(data) {
    const {group_id,student_id} = data
    sql  = "delete from enrollments group_id = ? && student_id = ?"
    params = [student_id,group_id]
    return await runDBQuery(sql,params)
}

module.exports = {
    getGroup,
    getGroups,
    deleteGroup,
    createGroup,
    updateGroup,
    enroll
}