const { getBooksDetails, addBooksDetails, addNewInsertion, getAllUsersInsertions, deleteInsertion, searchBooksInSameProvince, updateBookStatus} = require("./books.service");
const { Book, BookNoId, Insertion, InsertionFullDetails} = require("../../model/Book");
const request = require('request');
const moment = require("moment");
const Constants = require('../../constants/constants');

module.exports = {
    getBookByIsbn : (req, res) => {

        try{
            const isbn = req.params.isbn;

        if(!isbn || isbn.includes("&") || isbn.includes("|")){
            return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                code: Constants.HTTP_CODE_NOTFOUND,
                message: Constants.HTTP_MESSAGE_NOTFOUND,
            });
        }

        getBooksDetails(isbn, (err, result) => {

            if(err){
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                });
            }

            if(!result){

                request('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn, function(error, response, body) {

                    bodyParsed = JSON.parse(body);
                    
                    if(!bodyParsed || !bodyParsed.totalItems){

                        return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                            code: Constants.HTTP_CODE_NOTFOUND,
                            message: Constants.HTTP_MESSAGE_NOTFOUND
                        });

                    }else{

                        const bookFromGoogle = bodyParsed.items[0].volumeInfo;

                        console.log(bookFromGoogle);

                        let bookToAdd;

                        if(bookFromGoogle.imageLinks){
                            bookToAdd = new BookNoId(
                                getIsbn13(bookFromGoogle.industryIdentifiers),
                                bookFromGoogle.title,
                                getAuthorStringFromArray(bookFromGoogle.authors),
                                bookFromGoogle.publishedDate,
                                bookFromGoogle.imageLinks.smallThumbnail,
                                bookFromGoogle.imageLinks.thumbnail
                            );
                        }else{
                            bookToAdd = new BookNoId(
                                getIsbn13(bookFromGoogle.industryIdentifiers),
                                bookFromGoogle.title,
                                getAuthorStringFromArray(bookFromGoogle.authors),
                                bookFromGoogle.publishedDate,
                                "https://via.placeholder.com/210x300?text=NO+IMAGE",
                                "https://via.placeholder.com/210x300?text=NO+IMAGE"
                            );
                        }


                        addBooksDetails(bookToAdd, (err, results) => {
                            if(err){
                                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                                });
                            }

                            const id = results.insertId;

                            const bookToSend = new Book(
                                id,
                                bookToAdd.isbn,
                                bookToAdd.title,
                                bookToAdd.authors,
                                bookToAdd.publishedDate,
                                bookToAdd.smallThumbnailLink,
                                bookToAdd.thumbnailLink
                            );

                            res.status(Constants.HTTP_CODE_OK).json({
                                code: Constants.HTTP_CODE_OK,
                                message: Constants.HTTP_MESSAGE_OK,
                                result: bookToSend
                            });
                        })

                    }
                })
                
            }else{
                const book = new Book(result.Id, result.Isbn, result.Title, result.Authors, result.PublishedDate, result.SmallThumbnailLink, result.ThumbnailLink);

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                    result: book
                })
            }

        })

        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }
        
    },
    addNewInsertion : (req, res) => {

        try{

            const body = req.body;

            if(!body){
                return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                    code: Constants.HTTP_CODE_NOTFOUND,
                    message: Constants.HTTP_MESSAGE_EMPTY_BODY,
                });
            }

            body.idUser = req.authData.user.id; //getting the id from token and using it to populate the record in DB
            body.dateInsertion = moment().toDate();


            addNewInsertion(body, (err, results) => {
                
                if(err){

                    console.log(err);

                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    });
                }

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                });

            });

        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

        

    },
    getAllUsersInsertions : (req, res) => {

        try{

            const idUser = req.authData.user.id;

            getAllUsersInsertions(idUser, (err, results) => {
                
                if(err){

                    console.log(err);

                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    });
                }

                const insertions = [];

                results.forEach((el) => {
                    const insertion = new Insertion(el.Id, el.Isbn, el.Title, el.Authors, el.PublishedDate, el.SmallThumbnailLink, el.ThumbnailLink, el.BookStatus, el.Note, el.DateInsertion);
                    insertions.push(insertion);
                });

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                    result: insertions
                });

            })

        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

        
    },
    deleteInsertion : (req, res) => {


        try{

            const idInsertion = req.params.id;

            if(!idInsertion || idInsertion.includes("&") || idInsertion.includes("|")){
                return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                    code: Constants.HTTP_CODE_NOTFOUND,
                    message: Constants.HTTP_MESSAGE_INVALID_PARAMS,
                });
            }

            const idUser = req.authData.user.id;

            deleteInsertion(idInsertion, idUser, (err, result) => {

                if(err){

                    console.log(err);

                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    });
                }

                if(!result){
                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
                    });
                }

                if(result.affectedRows <= 0){
                    return res.status(Constants.HTTP_CODE_OK).json({
                        code: Constants.CODE_ERROR_RECORD_NOT_OWNED,
                        message: Constants.MESSAGE_ERROR_RECORD_NOT_OWNED,
                    });
                }

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                });

            });



        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

        
    },
    searchBooksInSameProvince : (req, res) => {

        try{

            const idUser = req.authData.user.id;
            const province = req.authData.user.province;

            searchBooksInSameProvince(idUser, province, (err, results) => {

                if(err){

                    console.log(err);

                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    });
                }

                const books = [];

                results.forEach(book => {
                    const bookToSend = new InsertionFullDetails(book.Username, book.Email, book.LastName, book.FirstName, book.City, book.Isbn, book.Title, book.Authors,
                        book.PublishedDate, book.SmallThumbnailLink, book.ThumbnailLink, book.BookStatus, book.Note, book.DateInsertion);

                    books.push(bookToSend);
                });

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                    result: books
                });
                
            });

        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

        

    },
    updateBookStatus : (req, res) => {

        try{

            const body = req.body;

            if(!body){
                return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                    code: Constants.HTTP_CODE_NOTFOUND,
                    message: Constants.HTTP_MESSAGE_EMPTY_BODY,
                });
            }

            const idUser = req.authData.user.id;

            updateBookStatus(body, idUser, (err, result) => {

                if(err){

                    console.log(err);

                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    });
                }


                if(!result){
                    return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                        code: Constants.HTTP_CODE_INTERNAL_ERROR,
                        message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
                    });
                }

                if(result.affectedRows <= 0){
                    return res.status(Constants.HTTP_CODE_OK).json({
                        code: Constants.CODE_ERROR_RECORD_NOT_OWNED,
                        message: Constants.MESSAGE_ERROR_RECORD_NOT_OWNED,
                    });
                }

                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                });


            })

        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

    }
}






//UTILITY FUNCTIONS
function getAuthorStringFromArray(authorsArray) {
    let stringAuthors = "";

    if(!authorsArray){
        return stringAuthors;
    }

    authorsArray.forEach(author => stringAuthors = stringAuthors + author + ", ");

    if(stringAuthors.length > 0){
        stringAuthors = stringAuthors.substring(0,stringAuthors.length - 2);
    }

    return stringAuthors;

}

function getIsbn13(identifiers){

    if(!identifiers){
        return null;
    }
    
    for(var i = 0; i < identifiers.length; i++){
        if(identifiers[i].type === "ISBN_13"){
            return identifiers[i].identifier;
        }
    }

    return null;
}