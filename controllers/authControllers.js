const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { query } = require('../config/db')

const login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { username, password } = req.body
    try {
        const results = await query('SELECT * FROM users WHERE username = ?', [username])
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' })
        }
        const user = results[0]
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: 'Invalid username or password' })
        }
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.json({ token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
module.exports = {
    login
}