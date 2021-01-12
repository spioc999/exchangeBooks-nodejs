const auth = require("basic-auth");
const compare = require("tsscmp");
const Constants = require("../constants/constants");
require('dotenv').config();


module.exports = {
    basicAuth : (req, res, next) => {

        try{

            var credentials = auth(req);

            if(!credentials || !check(credentials.name, credentials.pass)){
                return res.status(Constants.HTTP_CODE_UNAUTHORIZED).json({
                    code: Constants.HTTP_CODE_UNAUTHORIZED,
                    message: Constants.HTTP_MESSAGE_ERROR_BASIC_AUTH
                });
            }

            next();
            
        }catch(error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }

    }
}

function check(clientId, clientSecret) {

    var valid = true;

    valid = compare(clientId, process.env.CLIENT_ID) && valid;
    valid = compare(clientSecret, process.env.CLIENT_SECRET) && valid;

    return valid;
}