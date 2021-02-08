var expect = require("chai").expect;
var request = require("request");
require('dotenv').config();


describe("Users Api", function(){

    describe("POST /users", function(){

        it("Register without basic auth (401)", function(done){

            //no basic auth
            var url = "http://localhost:5000/api/users";
    
            request.post(
                url, 
                function(error, response, body) {
                    ///Should return unauthorized
                    expect(response.statusCode).to.equal(401);
                    done();
                }
            );
    
        });

        it("Register without body (404)", function(done){

            //basic auth
            var url = "http://" + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET + "@localhost:5000/api/users";
    
            request.post(
                url, 
                function(error, response, body) {
                    ///Should return unauthorized
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            );
    
        });
    
        it("Register correct (200)", function(done){
    
            //basic auth
            var url = "http://" + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET + "@localhost:5000/api/users";
    
            request.post(
                url,
                {
                    json: {
                        "username" : "test",
                        "psw" : "Password8",
                        "email" : "test@email.com",
                        "lastName" : "Test Surname",
                        "firstName" : "Test Name",
                        "city" : "Paceco",
                        "province": "TP"
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            );
    
        });

    });

    describe("POST /users/login", function(){

        it("Login without basic auth (401)", function(done){

            //no basic auth
            var url = "http://localhost:5000/api/users/login";
    
            request.post(
                url, 
                function(error, response, body) {
                    ///Should return unauthorized
                    expect(response.statusCode).to.equal(401);
                    done();
                }
            );
    
        });

        it("Login without body (404)", function(done){

            //basic auth
            var url = "http://" + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET + "@localhost:5000/api/users/login";
    
            request.post(
                url, 
                function(error, response, body) {
                    ///Should return unauthorized
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            );
    
        });

        it("Login invalid credentials (401)", function(done){

            //basic auth
            var url = "http://" + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET + "@localhost:5000/api/users/login";
    
            request.post(
                url,
                {
                    json: {
                        "email" : "test@email.com",
                        "psw" : "Password"
                    }
                },
                function(error, response, body) {
                    ///Should return 401
                    expect(response.statusCode).to.equal(401);
                    done();
                }
            );
    
        });
    
        it("Login correct (200)", function(done){
    
            //basic auth
            var url = "http://" + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET + "@localhost:5000/api/users/login";
    
            request.post(
                url,
                {
                    json: {
                        "email" : "test@email.com",
                        "psw" : "Password8"
                    }
                },
                function(error, response, body) {
    
                    //Should return ok
                    expect(response.statusCode).to.equal(200);
                    expect(body).to.have.property("result");
                    expect(body.result).to.have.property("bearerToken");
                    expect(body.result).to.have.property("user");
                    done();
                }
            );
    
        });

    });
    
});