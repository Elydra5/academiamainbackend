const express = require('express')
const studentController = require("../controllers/studentsController")

const router = express.Router()

function returnData(res,data) {
    if (data != null) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
}
function returnDataAffectedRows(res,data) {
    if (data.affectedRows == 1) {
        res.json(data)
        res.status(200)
    } else {
        res.json(404)
    }
}

router.get('/:id',async (req,res) => {
    data = await studentController.getStudent(req.params.id)
    returnData(res,data)
})
router.get('/', async (req,res) => {
    data = await studentController.getStudents()
    returnData(res,data)
})
router.post("/", async (req, res) => {
    try {
        const data = await studentController.createStudent(req.body)
        returnData(res, data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create student' })
    }
})
router.patch("/:id", async (req,res) => {
    data = await studentController.updateStudent(req.body,req.params.id)
    returnDataAffectedRows(res,data)
})
router.delete("/:id",async (req,res) => {
    data = await studentController.deleteStudent(req.params.id)
    console.log(data)
    returnDataAffectedRows(res,data)
})

module.exports = router