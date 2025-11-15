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
    return await runDBQuery(sql,params)
}
async function getGroups() {
    sql = "select * from course_group"
    return await runDBQuery(sql,[])
}
async function createGroup(data) {
    const {name,short_description,moodle_id,start_date,end_date,status,teacher,long_description} = data
    sql = "insert into course_groups (name, short_description, moodle_id, start_date, end_date, status, teacher, long_description) values (?,?,?,?,?,?,?,?)"
    params = [fname,sname,phone]
    return await runDBQuery(sql,params)
}
async function updateGroup(data,id) {
    const {name,short_description,moodle_id,start_date,end_date,status,teacher,long_description} = data
    sql = "update student set name = ?, short_description = ?, moodle_id = ?, start_date = ?, end_date = ?, status = ?, teacher = ?, long_description = ?"
    params = [fname,sname,phone,id]
    return await runDBQuery(sql,params)
}
async function deleteGroup(id) {
    sql = "delete from course_groups where id = ?"
    return await runDBQuery(sql,[id])
}

module.exports = {
    getGroup,
    getGroups,
    deleteGroup,
    createGroup,
    updateGroup
}