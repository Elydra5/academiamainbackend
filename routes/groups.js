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
    if (data != null && data.affectedRows == 1) {
        res.json(data)
        res.status(200)
    } else {
        res.status(404).json({error: "Not found or update failed"})
    }
}

router.get('/:id',async (req,res) => {
    data = await groupController.getGroup(req.params.id)
    if (data == null) {
        res.status(404).json({error: "Group not found"})
    } else {
        returnData(res,data)
    }
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
    const id = req.params.id;
    if (!id || id === 'undefined' || id === 'null') {
        res.status(400).json({error: "Invalid group id"});
        return;
    }
    
    data = await groupController.updateGroup(req.body, id);
    if (data == null) {
        res.status(404).json({error: "Group not found or update failed"});
    } else {
        returnData(res, data);
    }
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