// Requires
const express = require('express');
const Controller = require('../Controllers/Controller');
const APIError = require('../Services/ErrorService');

// Require Routes
const IndexController = require('../Controllers/IndexController');

const router = express.Router();

router.get("/", IndexController.get);

router.all('*', (req, res) => Controller.execute(req, res, async (req, res) => {
    const apiError = new APIError("Requisitada um request que não existe", 403);
    res.status(404).send("Not Found");
}));


module.exports = router;