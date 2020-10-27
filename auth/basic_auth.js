const auth = require("basic-auth");
const compare = require("tsscmp");
const Constants = require("../constants/constants");

module.exports = {
    basicAuth : (req, res, next) => {

        var credentials = auth(req);

        if(!credentials || !check(credentials.name, credentials.pass)){
            return res.status(Constants.HTTP_CODE_UNAUTHORIZED).json({
                code: Constants.HTTP_CODE_UNAUTHORIZED,
                message: Constants.HTTP_MESSAGE_ERROR_BASIC_AUTH
            });
        }

        next();

    }
}

function check(clientId, clientSecret) {

    var valid = true;

    valid = compare(clientId, Constants.CLIENT_ID) && valid;
    valid = compare(clientSecret, Constants.CLIENT_SECRET) && valid;

    return valid;
}