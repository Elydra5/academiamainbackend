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

async function getStudent(id) {
    sql = "select * from student where id = ?"
    params = [id]
    return await runDBQuery(sql,params)
}
async function getStudents() {
    sql = "select * from student"
    return await runDBQuery(sql,[])
}
async function createStudent(data) {
    const {first_name, last_name, phone} = data;
    const insertSql = "INSERT INTO student (first_name, last_name, phone) VALUES (?, ?, ?)";
    const insertParams = [first_name, last_name, phone];
    const insertResult = await runDBQuery(insertSql, insertParams);
    const selectSql = "SELECT * FROM student WHERE id = ?";
    const selectParams = [insertResult.insertId];
    const selectResult = await runDBQuery(selectSql, selectParams);
    return Array.isArray(selectResult) ? selectResult[0] : selectResult;
}
async function updateStudent(data,id) {
    const {first_name,last_name,phone} = data
    sql = "update student set first_name = ?, last_name = ?, phone = ? where id = ?"
    params = [first_name,last_name,phone,id]
    return await runDBQuery(sql,params)
}
async function deleteStudent(id) {
    sql = "delete from student where id = ?"
    return await runDBQuery(sql,[id])
}

module.exports = {
    getStudent,
    getStudents,
    deleteStudent,
    createStudent,
    updateStudent
}