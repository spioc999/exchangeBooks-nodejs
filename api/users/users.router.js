const { createUser, loginUser, getUserInfo} = require("./users.controller");
const { checkToken } = require("../../auth/token_validator");
const { basicAuth } = require("../../auth/basic_auth");

const router = require("express").Router();

/**
* @swagger
* /users/:
*   post:
*     tags:
*       — Users
*     summary: This should create a new user.
*     description: Login Endpoint
*     consumes:
*       — application/json
*     produces:
*       - application/json
*     parameters:
*       — name: body
*       in: body
*       schema:
*         type: object
*         properties:
*           flavor:
*           type: string
*     responses: 
*       200:
*         description: Receive back flavor and flavor Id.
*/
router.post("/", basicAuth, createUser);  //new user
router.post("/login", basicAuth, loginUser); //returning info of the current user

//router.get("/:id", checkToken, getUserInfo) //getting info of other users by id

module.exports = router;