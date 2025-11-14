const db = require("../config/db")

async function getStudent(id) {
    sql = "select * from student where id = ?"
    params = [id]
    try {
        data = await db.query(sql,params)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}
async function getStudents() {
    sql = "select * from student"
    try {
        data = await db.query(sql)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    getStudent
}