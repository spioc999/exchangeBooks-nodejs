const express = require('express');
//const request = require('request');
require('dotenv').config();

//ROUTERS
const usersRouter = require("./api/users/users.router");
const booksRouter = require("./api/books/books.router");

const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);

/* STATIC SWAGGER
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));*/


//DYNAMIC SWAGGER
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



const port = process.env.APP_PORT || 5000;
app.listen(port, () => console.log('Server started on port ' + port));