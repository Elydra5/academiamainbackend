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
    if (!id || id === 'undefined' || id === 'null') {
        return null;
    }
    
    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
        return null;
    }
    
    sql = "select * from course_group where id = ?"
    params = [numericId]
    const groupInfo = await runDBQuery(sql,params)

    if (!groupInfo || groupInfo.length === 0 || !groupInfo[0]) {
        return null;
    }

    const group = groupInfo[0];
    sql = "select * from enrollments where group_id = ?"
    params = [group.id]
    const studentIds = await runDBQuery(sql,params)
    if (studentIds.length == 0) {
        return {
            groupInfo: group
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
        groupInfo: group,
        students: students
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
    if (!id || id === 'undefined' || id === 'null') {
        return null;
    }
    
    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
        return null;
    }
    
    const {name,short_description,moodle_id,start_date,end_date,status,teacher,long_description} = data

    const formatDateForMySQL = (dateValue) => {
        if (!dateValue) return null;
        if (dateValue === '') return null;
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                return dateValue;
            }
            return null;
        }
    };
    
    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);
    
    sql = "update course_group set name = ?, short_description = ?, moodle_id = ?, start_date = ?, end_date = ?, status = ?, teacher = ?, long_description = ? where id = ?"
    params = [name,short_description,moodle_id,formattedStartDate,formattedEndDate,status,teacher,long_description,numericId]
    const updateResult = await runDBQuery(sql,params)
    
    if (updateResult && updateResult.affectedRows > 0) {
        const groupData = await getGroup(numericId);
        return groupData;
    }
    
    return updateResult;
}
async function deleteGroup(id) {
    sql = "delete from course_group where id = ?"
    return await runDBQuery(sql,[id])
}
async function enroll(data) {
    const group_id = data.group_id
    const student_id = data.student_id
    sql = "select * from enrollments where student_id = ? && group_id = ?"
    params = [student_id,group_id]
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