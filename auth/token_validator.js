const { verify } = require("jsonwebtoken");
const Constants = require('../constants/constants');
const jwt = require('jsonwebtoken');

module.exports = {

    checkToken : (req, res, next) => {

        if(isTokenPresent(req)){

            verify(req.token, process.env.KEY_TOKEN, (err, authData) => {

                if(err){

                    return res.status(Constants.HTTP_CODE_FORBIDDEN).json({
                        code: Constants.HTTP_CODE_FORBIDDEN,
                        message : Constants.HTTP_MESSAGE_FORBIDDEN
                    });

                }else{
                    //console.log(authData.user.id);
                    req.authData = authData;
                    next();

                }
            })
        }else{
            return res.status(Constants.HTTP_CODE_FORBIDDEN).json({
                code: Constants.HTTP_CODE_FORBIDDEN,
                message : Constants.HTTP_MESSAGE_FORBIDDEN
            });
        }
    },

    generateToken : (user, callback) => {

        jwt.sign(user, process.env.KEY_TOKEN, {
            expiresIn: Constants.EXPIRATION_TOKEN
        }, (err, token) => {

            if(err){
                callback(err);
            }else{
                callback(null, token);
            }
        })

    }
}

function isTokenPresent(req) {

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){

        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        req.token = bearerToken;

        return true;

    }
        
    return false;
}