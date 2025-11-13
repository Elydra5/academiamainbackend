require('dotenv').config()

const config = {
  db:{
      host: process.env.HOST,
      port: process.env.DB_PORT,
      password: process.env.PASS,
      user: process.env.DB_USER,
      database: process.env.DB
  },
}

module.exports = {config}