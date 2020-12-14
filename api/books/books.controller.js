const { getBooksDetails, addBooksDetails } = require("./books.service");
const { Book, BookNoId} = require("../../model/Book");
const request = require('request');
const Constants = require('../../constants/constants');

module.exports = {
    getBookByIsbn : (req, res) => {
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

                        const bookToAdd = new BookNoId(
                            getIsbn13(bookFromGoogle.industryIdentifiers),
                            bookFromGoogle.title,
                            getAuthorStringFromArray(bookFromGoogle.authors),
                            bookFromGoogle.publishedDate,
                            bookFromGoogle.imageLinks.smallThumbnail,
                            bookFromGoogle.imageLinks.thumbnail
                        );

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
    }
}

function getAuthorStringFromArray(authorsArray) {
    let stringAuthors = "";

    authorsArray.forEach(author => stringAuthors = stringAuthors + author + ", ");

    if(stringAuthors.length > 0){
        stringAuthors = stringAuthors.substring(0,stringAuthors.length - 2);
    }

    return stringAuthors;

}

function getIsbn13(identifiers){
    
    for(var i = 0; i < identifiers.length; i++){
        if(identifiers[i].type === "ISBN_13"){
            return identifiers[i].identifier;
        }
    }

    return null;
}