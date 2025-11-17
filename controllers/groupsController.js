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
function getQuestionMarks(number) {
    out = ""
    for (i = 0; i < number-1; i++) {
        out += "?,"
    }
    return out+"?"
}

async function getGroup(id) {
    sql = "select * from course_group where id = ?"
    params = [id]
    const groupInfo =  await runDBQuery(sql,params)
    sql = "select * from enrollments where group_id = ?"
    params = [groupInfo[0].id]
    const studentIds = await runDBQuery(sql,params)
    if (studentIds.length == 0) {
        return {
            groupInfo:groupInfo
        }
    }
    sql = "select * from student where id in ("+getQuestionMarks(studentIds.length)+")"
    getStudents = () => {
        ids = []
        studentIds.forEach(element => {
            ids.push(element.student_id)
        });
        return ids
    }
    const students = await runDBQuery(sql,getStudents())
    return {
        groupInfo:groupInfo[0],
        students:students
    }
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
    sql = "update course_group set name = ?, short_description = ?, moodle_id = ?, start_date = ?, end_date = ?, status = ?, teacher = ?, long_description = ? where id = ?"
    params = [name,short_description,moodle_id,start_date,end_date,status,teacher,long_description,id]
    return await runDBQuery(sql,params)
}
async function deleteGroup(id) {
    sql = "delete from course_groups where id = ?"
    return await runDBQuery(sql,[id])
}
async function enroll(data) {
    console.log("enrolling student")
    const group_id = data.group_id
    const student_id = data.student_id
    sql = "select * from enrollments where student_id = ? && group_id = ?"
    params = [student_id,group_id]
    console.log("Student:"+student_id)
    console.log("Group:"+group_id)
    exists = await runDBQuery(sql,params)
    if (exists.length != 0) {
        return {affectedRows:0}
    }
    sql  = "insert into enrollments (student_id, group_id) values (?,?)"
    return await runDBQuery(sql,params)
}
async function disenroll(data) {
    const {group_id,student_id} = data
    sql  = "delete from enrollments where group_id = ? && student_id = ?"
    params = [student_id,group_id]
    return await runDBQuery(sql,params)
}

module.exports = {
    getGroup,
    getGroups,
    deleteGroup,
    createGroup,
    updateGroup,
    enroll,
    disenroll
}