const pool = require("../../config/database");

module.exports = {
    getInfoByCap : (cap, callback) => {
        pool.query(
            "select * from ZipCodes where Cap = ?",
            [
                cap
            ],
            (error, results, fields) => {
                if(error){
                    return callback(error);
                }

                return callback(null, results);
            }
        )
    }
}