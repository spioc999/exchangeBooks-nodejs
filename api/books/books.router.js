const { checkToken } = require("../../auth/token_validator");
const { getBookByIsbn } = require("./books.controller");

const router = require("express").Router();

//TODO
router.get("/details/:isbn", checkToken, getBookByIsbn); //get information from Books table, otherwise from google api
router.post("/", checkToken); //add new book
router.get("/", checkToken); //get books uploaded
router.put("/:id", checkToken); //update book status
router.get("/search/", checkToken); //search in the same province, if present the isbn with the isbn in the province

module.exports = router;