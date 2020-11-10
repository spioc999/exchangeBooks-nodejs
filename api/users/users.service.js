const pool = require("../../config/database");

module.exports = {
    create : (data, callBack) => {
        pool.query(
            "insert into Users(Username, Psw, Email, LastName, FirstName, Cap) " +
            "values (?, ?, ?, ?, ?, ?)",
            [
                data.username,
                data.psw,
                data.email,
                data.lastName,
                data.firstName,
                data.cap
            ],
            (error, results, fields) => {

                if(error){
                    return callBack(error);
                }

                return callBack(null, results);
            }
        );
    },
    getUserByEmail : (email, callback) => {
        pool.query(
            "select * from Users where Email = ?",
            [email],
            (error, results, fields) => {

                if(error){
                    return callback(error);
                }

                return callback(null, results[0]);
            }
        );
    },
    getUserById : (id, callback) => {
        pool.query(
            "select * from Users where Id = ?",
            [parseInt(id)],
            (error, results, fields) => {
                
                if(error){
                    return callback(error);
                }

                return callback(null, results[0]);
            }
        )
    }
}