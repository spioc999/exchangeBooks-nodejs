var expect = require("chai").expect;
var request = require("request");
require('dotenv').config();

describe("Books Api", function(){

    var token = null;

    before(function(done){

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

                token = body.result.bearerToken;
                done();
                
            }
        );

    });

    describe("GET /books/search", function(){
        it("Search without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/search";
    
            request.get(
                {
                    url: url,
                },
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });
    
        it("Search with token (200)", function(done){
            
            var url = "http://localhost:5000/api/books/search";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    const bodyConverted = JSON.parse(body);
                    expect(bodyConverted).to.have.property("result");
                    expect(bodyConverted.result).to.be.a('array');
                    done();
                }
            )
    
        });

    });

    describe("GET /books/details/:isbn", function(){

        it("Get Book's details without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/details/978985769486";
    
            request.get(
                {
                    url: url,
                },
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });
    
        it("Get Book's details without isbn (404)", function(done){
            
            var url = "http://localhost:5000/api/books/details/";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return not found 404
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            )
    
        });
    
        it("Get Book's details with invalid isbn (404)", function(done){
            
            var url = "http://localhost:5000/api/books/details/8976455";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return not found 404
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            )
    
        });

        it("Get Book's details with valid isbn (200)", function(done){
            
            var url = "http://localhost:5000/api/books/details/9788850334384";
            var authorization = "Bearer " + token;
    
            request(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    const bodyConverted = JSON.parse(body);
                    expect(bodyConverted).to.have.property("result");
                    expect(bodyConverted.result).to.have.property("id");
                    expect(bodyConverted.result).to.have.property("isbn");
                    expect(bodyConverted.result).to.have.property("title");
                    expect(bodyConverted.result).to.have.property("authors");
                    expect(bodyConverted.result).to.have.property("publishedDate");
                    expect(bodyConverted.result).to.have.property("thumbnailLink");
                    done();
                    //expect(response.body).have.property("result");
                }
            )
    
        });

    });

    describe("POST /books", function(){

        var idBook;

        before(function(done){

            var url = "http://localhost:5000/api/books/details/9788850334384";
            var authorization = "Bearer " + token;
    
            request(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {

                    var bodyConverted = JSON.parse(body);
    
                    idBook = bodyConverted.result.id;

                    done();
                    
                }
            );
    
        });

        it("Add Book without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/";
    
            request.post(
                {
                    url: url,
                    json: {
                        "idBook": idBook,
                        "note": "ok"
                    }
                },
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });

        it("Add Book without body (404)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.post(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return not found 404
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            )
    
        });

        it("Add Book correct (200)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.post(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    },
                    json: {
                        "idBook": idBook,
                        "note": "ok"
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            )
    
        });

    });

    describe("GET /books", function(){

        it("Get Books without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/";
    
            request(
                url,
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });

        it("Get Books correct (200)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    },
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    const bodyConverted = JSON.parse(body);
                    expect(bodyConverted).to.have.property("result");
                    expect(bodyConverted.result).to.be.a('array');
                    expect(bodyConverted.result[0]).to.have.property("id");
                    expect(bodyConverted.result[0]).to.have.property("isbn");
                    expect(bodyConverted.result[0]).to.have.property("title");
                    expect(bodyConverted.result[0]).to.have.property("authors");
                    expect(bodyConverted.result[0]).to.have.property("publishedDate");
                    expect(bodyConverted.result[0]).to.have.property("thumbnailLink");
                    expect(bodyConverted.result[0]).to.have.property("bookStatus");
                    expect(bodyConverted.result[0]).to.have.property("note");
                    expect(bodyConverted.result[0]).to.have.property("dateInsertion");
                    done();
                }
            )
    
        });


    });

    describe("PUT /books", function(){

        var idBook;

        before(function(done){

            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    },
                },
                function(error, response, body) {
                    const bodyConverted = JSON.parse(body);
                    idBook = bodyConverted.result[0].id;
                    done();
                }
            )

        });

        it("Update book status without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/";
    
            request.put(
                {
                    url: url,
                    json: {
                        "id": idBook,
                        "status": 2
                    }
                },
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });

        it("Update book status without body (404)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.put(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return not found 404
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            )
    
        });

        it("Update book status correct (200)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.put(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    },
                    json: {
                        "id": idBook,
                        "status": 2
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            )
    
        });

    });


    describe("DELETE /books/:id", function(){

        var idBook;

        before(function(done){

            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.get(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    },
                },
                function(error, response, body) {
                    const bodyConverted = JSON.parse(body);
                    idBook = bodyConverted.result[0].id;
                    done();
                }
            )

        });
        
        it("Delete Book without token (403)", function(done){
        
            var url = "http://localhost:5000/api/books/" + idBook;
    
            request.delete(
                {
                    url: url,
                },
                function(error, response, body) {
                    ///Should return forbidden
                    expect(response.statusCode).to.equal(403);
                    done();
                }
            )
    
        });
    
        it("Delete Book without id (404)", function(done){
            
            var url = "http://localhost:5000/api/books/";
            var authorization = "Bearer " + token;
    
            request.delete(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return not found 404
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            )
    
        });
    
        it("Delete Book not owned (code 20)", function(done){
            
            var url = "http://localhost:5000/api/books/1";
            var authorization = "Bearer " + token;
    
            request.delete(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return error code 20
                    const bodyConverted = JSON.parse(body);
                    expect(bodyConverted.code).to.equal(20);
                    expect(response.statusCode).to.equal(200);
                    done();
                }
            )
    
        });

        it("Delete Book correct (200)", function(done){
            
            var url = "http://localhost:5000/api/books/"+ idBook;
            var authorization = "Bearer " + token;
    
            request.delete(
                {
                    url: url,
                    headers : {
                        "Authorization" : authorization
                    }
                },
                function(error, response, body) {
                    ///Should return ok
                    expect(response.statusCode).to.equal(200);
                    const bodyConverted = JSON.parse(body);
                    expect(bodyConverted.code).to.equal(200);
                    done();
                }
            )
    
        });

    });
    

});