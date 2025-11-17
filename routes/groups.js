const express = require('express')
const groupController = require("../controllers/groupsController")

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
    data = await groupController.getGroup(req.params.id)
    returnData(res,data)
})
router.get('/', async (req,res) => {
    data = await groupController.getGroups()
    returnData(res,data)
})
router.post("/", async (req,res) => {
    data = await groupController.createGroup(req.body)
    returnData(res,data)
})
router.patch("/:id", async (req,res) => {
    data = await groupController.updateGroup(req.body,req.params.id)
    returnDataAffectedRows(res,data)
})
router.delete("/:id",async (req,res) => {
    data = await groupController.deleteGroup(req.params.id)
    console.log(data)
    returnDataAffectedRows(res,data)
})
router.post("/enroll/:group_id/:student_id", async (req,res) => {
    data = await groupController.enroll(req.params)
    returnDataAffectedRows(res,data)
})
router.delete("/disenroll/:group_id/:student_id", async (req,res) => {
    data = await groupController.disenroll(req.params)
})

module.exports = router