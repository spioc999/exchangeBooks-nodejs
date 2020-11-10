const Constants = require("../../constants/constants");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { create, getUserByEmail, getUserById } = require("./users.service");
const { generateToken } = require("../../auth/token_validator");

module.exports = {
    createUser : (req, res) => {
        const body = req.body;
        const salt = genSaltSync(Constants.SALT_PSW); //encryption of the password
        body.psw = hashSync(body.psw, salt);

        create(body, (err, result) => {    //callback

            if(err){
                console.log(err);
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
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
        getUserByEmail(body.email, (err, result) => {

            if(err){
                console.log(err);
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                });
            }

            if(!result){
                return res.status(Constants.HTTP_CODE_UNAUTHORIZED).json({
                    code: Constants.HTTP_CODE_UNAUTHORIZED,
                    message: Constants.HTTP_MESSAGE_UNAUTHORIZED
                });
            }

            const resultPswCheck = compareSync(body.psw, result.Psw);

            if(resultPswCheck){

                const user = {
                    id : result.Id,
                    username : result.Username,
                    email : result.Email,
                    lastName : result.LastName,
                    firstName : result.FirstName,
                    cap : result.Cap
                }
                
                generateToken(user, (err, token) => {

                    if(err){
                        return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                            code: Constants.HTTP_CODE_INTERNAL_ERROR,
                            message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
                        });
                    }
                    
                    const userToSend = {
                        username : result.Username,
                        email : result.Email,
                        lastName : result.LastName,
                        firstName : result.FirstName,
                        cap : result.Cap
                    }

                    return res.status(Constants.HTTP_CODE_OK).json({
                        code: Constants.HTTP_CODE_OK,
                        message: Constants.HTTP_MESSAGE_OK,
                        result: {
                            bearerToken : token,
                            user: userToSend
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
    },

    getUserInfo : (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, result) => {
            if(err){
                console.log(err);
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                });
            }

            if(!result){
                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_RESULT_EMPTY,
                    message: Constants.HTTP_MESSAGE_RESULT_EMPTY,
                });
            }else{

                const user = {
                    username : result.Username,
                    email : result.Email,
                    lastName : result.LastName,
                    firstName : result.FirstName,
                    cap : result.Cap
                }
    
                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                    result: user
                });
    
            }
        });
    }
}