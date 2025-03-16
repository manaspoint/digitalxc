const express = require("express");
const validator = require("../validator/game.validator");
const upload = require("../middlewares/upload.middleware");
const router = express.Router();
const gameController = require("../controller/game.controller");

router.post("/select-child", upload, validator.validateFile, gameController.selectchild);
module.exports = router;
