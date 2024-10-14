const express = require("express");
const { getTopics } = require("./controllers/topics.controller");   
const { error500 } = require("./error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.all('*', (request, response, next) => {
    response.status(404).send({ msg: "Not Found"});
    next(err);
})

app.use(error500);
module.exports = app;