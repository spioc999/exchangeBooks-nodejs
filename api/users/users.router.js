const { createUser, loginUser} = require("./users.controller");
const { checkToken } = require("../../auth/token_validator");
const { basicAuth } = require("../../auth/basic_auth");

const router = require("express").Router();

router.post("/", basicAuth, createUser);
router.post("/login", basicAuth, loginUser);

module.exports = router;