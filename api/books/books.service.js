const pool = require("../../config/database");

module.exports = {
    getBooksDetails : (isbn, callback) => {
        pool.query(
            "select * from Books where Isbn = ?",
            [isbn],
            (error, results, fields) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results[0]);
            }
        )
    },
    addBooksDetails : (data, callback) => {
        pool.query(
            "insert into Books(Isbn, Title, AllAuthors, PublishedDate, ThumbnailLink) " +
            "values (?, ?, ?, ?, ?, ?)",
            [
                data.isbn,
                data.title,
                data.authors,
                data.publishedDate,
                data.thumbnailLink
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }
        )
    },
    addNewInsertion : (data, callback) => {
        pool.query(
            "insert into Insertions(IdBook, IdUser, BookStatus, Note, DateInsertion) " + 
            "values (?, ?, ?, ?, ?)",
            [
                data.idBook,
                data.idUser,
                1, //1 AVAILABLE (by default) - 2 IN TALKS - 3 NOT AVAILABLE 
                data.note,
                data.dateInsertion
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }
        )
    },
    getAllUsersInsertions : (idUser, callback) => {
        pool.query(
            "select I.Id, B.Isbn, B.Title, B.AllAuthors, B.PublishedDate, B.ThumbnailLink, I.BookStatus, I.Note, I.DateInsertion " +
            "from Insertions as I inner join Books as B on I.IdBook = B.Id " +
            "where I.IdUser = ? " + 
            "order by I.DateInsertion DESC",
            [
                idUser
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }   
        )
    },
    deleteInsertion : (idInsertion, idUser, callback) => {
        pool.query(
            "delete from Insertions " + 
            "where Id = ? and IdUser = ?",
            [
                idInsertion,
                idUser
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            } 
        )
    },
    searchBooksInSameProvince : (idUser, province, callback) => {

        pool.query(
            "select U.Username, U.Email, U.LastName, U.FirstName, U.City, B.Isbn, B.Title, B.AllAuthors, B.PublishedDate, B.ThumbnailLink, " +
            "I.BookStatus, I.Note, I.DateInsertion from Users U inner join Insertions I on U.Id = I.IdUser " + 
            "inner join Books B on I.IdBook = B.Id " + 
            "where I.IdUser <> ? and U.Province = ? and I.BookStatus <> 3 " + 
            "order by I.DateInsertion DESC",
            [
                idUser,
                province
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }
        )

    },
    updateBookStatus : (data, idUser, callback) => {

        pool.query(
            "update Insertions " +
            "set BookStatus = ? " +
            "where Id = ? and IdUser = ?",
            [
                data.status,
                data.id,
                idUser
            ],
            (error, results) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }
        )
    }
}