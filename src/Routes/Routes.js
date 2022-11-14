// Requires
const express = require('express');
const Controller = require('../Controllers/Controller');
const APIError = require('../Services/ErrorService');

// Require Routes
const IndexController = require('../Controllers/IndexController');
const RecordController = require('../Controllers/RecordController');
const UserController = require('../Controllers/UserController');
const HealthEntityController = require('../Controllers/HealthEntityController');
const UserNFTKeyController = require('../Controllers/UserNFTKeyController');
const UserNFTKeyHealthEntityController = require('../Controllers/UserNFTKeyHealthEntityController');

const AuthMiddleware = require('../Middlewares/AuthMiddleware');
const KeyOwnerMiddleware = require('../Middlewares/KeyOwnerMiddleware');

const router = express.Router();

router.get("/", IndexController.get);

router.post("/user", UserController.create);
router.post("/login", UserController.login);
router.get("/user", AuthMiddleware.verifyUserToken, UserController.get);
router.put("/user", AuthMiddleware.verifyUserToken, UserController.update);
router.delete("/user", AuthMiddleware.verifyUserToken, UserController.delete);

router.post("/health-entity", HealthEntityController.create);
router.post("/health-entity/login", HealthEntityController.login);
router.get("/health-entity", AuthMiddleware.verifyHealthEntityToken, HealthEntityController.get);
router.put("/health-entity", AuthMiddleware.verifyHealthEntityToken, HealthEntityController.update);
router.delete("/health-entity", AuthMiddleware.verifyHealthEntityToken, HealthEntityController.delete);

router.post("/keys/health-entity", AuthMiddleware.verifyUserToken, UserNFTKeyHealthEntityController.create);
router.get("/keys/:userNFTKeyId/health-entity/:healthEntityId", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyHealthEntityOwner, UserNFTKeyHealthEntityController.get);
router.get("/keys/:userNFTKeyId/health-entity", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyOwner, UserNFTKeyHealthEntityController.allByKeyId);
router.get("/health-entity/:healthEntityId/keys", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyOwner, UserNFTKeyHealthEntityController.allByHealthEntityId);
router.delete("keys/:userNFTKeyId/health-entity/:healthEntityId", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyHealthEntityOwner, UserNFTKeyHealthEntityController.delete);

router.post("/keys", AuthMiddleware.verifyUserToken, UserNFTKeyController.create);
router.get("/keys/:id", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyOwner, UserNFTKeyController.get);
router.get("/keys", AuthMiddleware.verifyUserToken, UserNFTKeyController.all);
router.delete("/keys/:id", AuthMiddleware.verifyUserToken, KeyOwnerMiddleware.verifyKeyOwner, UserNFTKeyController.delete);

router.post("/records", RecordController.post);

router.all('*', (req, res) => Controller.execute(req, res, async (req, res) => {
    const apiError = new APIError("Requisitada um request que não existe", 403);
    res.status(404).send("Not Found");
}));


module.exports = router;