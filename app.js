const express = require('express');
require('dotenv').config();

//ROUTERS
const usersRouter = require("./api/users/users.router");

const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);

const port = process.env.APP_PORT || 5000;
app.listen(port, () => console.log('Server started on port ' + port));