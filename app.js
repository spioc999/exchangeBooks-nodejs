const express = require('express');
//const request = require('request');
require('dotenv').config();
var path = require('path');

//ROUTERS
const usersRouter = require("./api/users/users.router");
const booksRouter = require("./api/books/books.router");

const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);

// STATIC SWAGGER
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//TODO
app.get("/", function(request, response){

    var filePath = "./index.html"
    var resolvedPath = path.resolve(filePath);
    response.sendFile(resolvedPath);

})

app.get("/public/img/:name", function(request, response){

    try{

        const name = request.params.name

        if(!name){
            return response.status(400).json({
                code: 400,
                message: "Error"
            });
        }

        var filePath = "./public/img/" + name;
        var resolvedPath = path.resolve(filePath);
        response.sendFile(resolvedPath);


    }catch(e){

        return response.status(500).json({
            code: 500,
            message: "Error"
        });
    }
});

//DYNAMIC SWAGGER TODO
/*const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
*/


const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server started on port ' + port));