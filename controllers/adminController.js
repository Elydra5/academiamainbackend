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

async function getUser(id) {
    sql = "select * from users where username = ?"
    params = [id]
    return await runDBQuery(sql,params)
}
async function getUsers() {
    sql = "select * from users"
    return await runDBQuery(sql,[])
}
async function createUser(data) {
    const {username,password,role,first_name,last_name,email,moodle_id,status} = data
    sql = "insert into users (username,password,role,first_name,last_name,email,moodle_id,status) values (?,?,?,?,?,?)"
    params = [username,password,role,first_name,last_name,email,moodle_id,status]
    return await runDBQuery(sql,params)
}
async function updateUser(data,id) {
    const {username,password,role,first_name,last_name,email,moodle_id,status} = data
    sql = "update users set username = ?,password = ?,role = ?,first_name = ?,last_name = ?,email = ?,moodle_id = ?,status = ?"
    params = [username,password,role,first_name,last_name,email,moodle_id,status]
    return await runDBQuery(sql,params)
}
async function deleteUser(id) {
    sql = "delete from course_groups where id = ?"
    return await runDBQuery(sql,[id])
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    createUser,
    updateUser
}