const express = require('express')
const studentController = require("../controllers/studentsController")

const router = express.Router()

router.get('/:id',async (req,res) => {
    data = await studentController.getStudent(req.params.id)
    if (data != null) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
})
router.get('', async (req,res) => {
    data = await studentController.getStudents()
    if (data != null) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
})

module.exports = router