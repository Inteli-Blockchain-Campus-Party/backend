// Requires
const express = require('express');
const Controller = require('../Controllers/Controller');
const APIError = require('../Services/ErrorService');

// Require Routes
const IndexController = require('../Controllers/IndexController');
const RecordController = require('../Controllers/RecordController');
const UserController = require('../Controllers/UserController');


const router = express.Router();

router.get("/", IndexController.get);

router.post("/user", UserController.create);
router.post("/login", UserController.login);
router.get("/user", UserController.get);
router.put("/user", UserController.update);
router.delete("/user", UserController.delete);

router.post("/records", RecordController.post);

router.all('*', (req, res) => Controller.execute(req, res, async (req, res) => {
    const apiError = new APIError("Requisitada um request que não existe", 403);
    res.status(404).send("Not Found");
}));


module.exports = router;