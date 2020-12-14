const pool = require("../../config/database");

module.exports = {
    getBooksDetails : (isbn, callback) => {
        pool.query(
            "select * from Books where Isbn = ?",
            [isbn],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }

                return callback(null, results[0]);
            }
        )
    },
    addBooksDetails : (data, callback) => {
        pool.query(
            "insert into Books(Isbn, Title, Authors, PublishedDate, SmallThumbnailLink, ThumbnailLink) " +
            "values (?, ?, ?, ?, ?, ?)",
            [
                data.isbn,
                data.title,
                data.authors,
                data.publishedDate,
                data.smallThumbnailLink,
                data.thumbnailLink
            ],
            (error, results) => {
                if(error){
                    return callBack(error);
                }

                return callback(null, results);
            }
        )
    }
}