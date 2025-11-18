const express = require('express')
const adminController = require("../controllers/adminController")

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

router.get('/:username',async (req,res) => {
    data = await adminController.getUser(req.params.username)
    returnData(res,data)
})
router.get('/', async (req,res) => {
    data = await adminController.getUsers()
    returnData(res,data)
})
router.post("/", async (req, res) => {
    data = await adminController.createUser(req.body)
    returnData(res,data)
})
router.patch("/:id", async (req,res) => {
    data = await adminController.updateUser(req.body,req.params.id)
    returnDataAffectedRows(res,data)
})
router.delete("/:id",async (req,res) => {
    data = await adminController.deleteUser(req.params.id)
    console.log(data)
    returnDataAffectedRows(res,data)
})

module.exports = router