const {getInfoByCap} = require("./zipCodes.controller");
const router = require("express").Router();

router.get("/:cap", getInfoByCap); //NO authentication, just public info about places

module.exports = router;