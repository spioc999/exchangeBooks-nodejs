const { checkToken } = require("../../auth/token_validator");
const { getBookByIsbn, addNewInsertion, getAllUsersInsertions, deleteInsertion, searchBooksInSameProvince, updateBookStatus} = require("./books.controller");

const router = require("express").Router();


router.get("/details/:isbn", checkToken, getBookByIsbn); //get information from Books table, otherwise from google api
router.post("/", checkToken, addNewInsertion); //add new book
router.get("/", checkToken, getAllUsersInsertions); //get books uploaded by tha specific user 
router.delete("/:id", checkToken, deleteInsertion); //delete using id (idUser has to be the same)
router.get("/search", checkToken, searchBooksInSameProvince); //search in the same province, if present the isbn with the isbn in the province
router.put("/", checkToken, updateBookStatus); //update book status

//TODO
/*
router.post("/following/", checkToken); //adding record when user click on contact user
router.get("/following/", checkToken); //getting all following books
router.delete("/following/:id", checkToken); //removing following record
*/

module.exports = router;