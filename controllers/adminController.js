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

async function getUser(username) {
    sql = "select username, role, first_name, last_name, email, moodle_id, last_login, status from users where username = ?"
    params = [username]
    return await runDBQuery(sql,params)
}
async function getUsers() {
    sql = "select username, first_name, last_name from users"
    return await runDBQuery(sql,[])
}
async function createUser(data) {
    const {username,password,role,first_name,last_name,email,moodle_id,status} = data
    sql = "insert into users (username,password,role,first_name,last_name,email,moodle_id,status) values (?,?,?,?,?,?,?,?)"
    params = [
        username ?? null,
        password ?? null,
        role ?? null,
        first_name ?? null,
        last_name ?? null,
        email ?? null,
        moodle_id ?? null,
        status ?? null
    ]
    return await runDBQuery(sql,params)
}
async function updateUser(data,id) {
    const {username,password,role,first_name,last_name,email,moodle_id,status} = data
    sql = "update users set username = ?,password = ?,role = ?,first_name = ?,last_name = ?,email = ?,moodle_id = ?,status = ? where username = ?"
    
    params = [
        username ?? null,
        password ?? null,
        role ?? null,
        first_name ?? null,
        last_name ?? null,
        email ?? null,
        moodle_id ?? null,
        status ?? null,
        id
    ]
    return await runDBQuery(sql,params)
}
async function deleteUser(id) {
    sql = "delete from users where username = ?"
    return await runDBQuery(sql,[id])
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    createUser,
    updateUser
}