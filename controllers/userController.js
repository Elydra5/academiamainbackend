const jwt = require('jsonwebtoken');


function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Nincs token. Jelentkezz be.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Érvénytelen vagy lejárt token.' });
    }
}

async function getProfile(req, res) {
    return res.json({
        message: 'Sikeres elérés, bejelentkezett felhasználó.',
        user: req.user
    });
}

module.exports = {
    authenticate,
    getProfile
};