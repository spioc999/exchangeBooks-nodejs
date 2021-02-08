const Constants = require("../../constants/constants");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { create, getUserByEmail, getUserById } = require("./users.service");
const { generateToken } = require("../../auth/token_validator");

const {User, UserNoId} = require("../../model/User");

module.exports = {
    createUser : (req, res) => {

        try{

            const body = req.body;

            if(!body || Object.keys(body).length === 0){
                return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                    code: Constants.HTTP_CODE_NOTFOUND,
                    message: Constants.HTTP_MESSAGE_EMPTY_BODY,
                });
            }

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


        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }
    },

    loginUser : (req, res) => {

        try{
            
            const body = req.body;
        
            if(!body || Object.keys(body).length === 0){
                return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                    code: Constants.HTTP_CODE_NOTFOUND,
                    message: Constants.HTTP_MESSAGE_EMPTY_BODY,
                });
            }

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

                    const user = new User(result.Id, result.Username, result.Email, result.LastName, result.FirstName, result.City, result.Province);
                                    
                    generateToken({user}, (err, token) => {

                        if(err){
                            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
                            });
                        }

                        const userToSend = new UserNoId(result.Username, result.Email, result.LastName, result.FirstName, result.City, result.Province);

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


        }catch (error){
            
            return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                code: Constants.HTTP_CODE_INTERNAL_ERROR,
                message: Constants.HTTP_MESSAGE_INTERNAL_ERROR,
            });

        }
    },

    /*getUserInfo : (req, res) => {
        const id = req.params.id;

        if(!id || id.includes("&") || id.includes("|")){
            return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                code: Constants.HTTP_CODE_NOTFOUND,
                message: Constants.HTTP_MESSAGE_NOTFOUND,
            });
        }

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

                const user = new User(result.Id, result.Username, result.Email, result.LastName, result.FirstName, result.City, result.Province);
    
                return res.status(Constants.HTTP_CODE_OK).json({
                    code: Constants.HTTP_CODE_OK,
                    message: Constants.HTTP_MESSAGE_OK,
                    result: user
                });
    
            }
        });
    }*/
}