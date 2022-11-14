// Requires
const express = require('express');
const Controller = require('../Controllers/Controller');
const APIError = require('../Services/ErrorService');

// Require Routes
const IndexController = require('../Controllers/IndexController');
const RecordController = require('../Controllers/RecordController');
const UserController = require('../Controllers/UserController');
const HealthEntityController = require('../Controllers/HealthEntityController');

const AuthMiddleware = require('../Middlewares/AuthMiddleware');

const router = express.Router();

router.get("/", IndexController.get);

router.post("/user", UserController.create);
router.post("/login", UserController.login);
router.get("/user", AuthMiddleware.verifyUserToken, UserController.get);
router.put("/user", AuthMiddleware.verifyUserToken, UserController.update);
router.delete("/user", AuthMiddleware.verifyUserToken, UserController.delete);

router.post("/health-entity", HealthEntityController.create);
router.post("/health-entity/login", HealthEntityController.login);
router.get("/health-entity", AuthMiddleware.verifyUserToken, HealthEntityController.get);
router.put("/health-entity", AuthMiddleware.verifyUserToken, HealthEntityController.update);
router.delete("/health-entity", AuthMiddleware.verifyUserToken, HealthEntityController.delete);

router.post("/records", RecordController.post);

router.all('*', (req, res) => Controller.execute(req, res, async (req, res) => {
    const apiError = new APIError("Requisitada um request que não existe", 403);
    res.status(404).send("Not Found");
}));


module.exports = router;