const Constants = require("../../constants/constants");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { create, getUserByEmail } = require("./users.service");
const { generateToken } = require("../../auth/token_validator");

module.exports = {
    createUser : (req, res) => {
        const body = req.body;
        const salt = genSaltSync(Constants.SALT_PSW); //encryption of the password
        body.psw = hashSync(body.psw, salt);

        create(body, (err, results) => {    //callback

            if(err){
                console.log(err);
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    error: err
                })
            }

            return res.status(Constants.HTTP_CODE_OK).json({
                code: Constants.HTTP_CODE_OK,
                message: Constants.HTTP_MESSAGE_OK,
            })
        })
    },

    loginUser : (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {

            if(err){
                console.log(err);
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                    error: err
                });
            }

            if(!results){
                return res.status(Constants.HTTP_CODE_UNAUTHORIZED).json({
                    code: Constants.HTTP_CODE_UNAUTHORIZED,
                    message: Constants.HTTP_MESSAGE_UNAUTHORIZED
                });
            }

            const result = compareSync(body.psw, results.Psw);

            if(result){

                const user = {
                    id : results.Id,
                    username : results.Username,
                    email : results.Email,
                    lastName : results.LastName,
                    firstName : results.FirstName,
                    cap : results.Cap
                }
                
                generateToken(user, (err, token) => {

                    if(err){
                        return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                            code: Constants.HTTP_CODE_INTERNAL_ERROR,
                            message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
                            error: err
                        });
                    }
                    
                    return res.status(Constants.HTTP_CODE_OK).json({
                        code: Constants.HTTP_CODE_OK,
                        message: Constants.HTTP_MESSAGE_OK,
                        result: {
                            bearerToken : token
                        },
                    });

                })

            }else{

                return res.status(Constants.HTTP_CODE_UNAUTHORIZED).json({
                    code: Constants.HTTP_CODE_UNAUTHORIZED,
                    message: Constants.HTTP_MESSAGE_UNAUTHORIZED
                });

            }

        })
    }
}