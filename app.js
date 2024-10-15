const express = require("express");
const { getTopics } = require("./controllers/topics.controller");   
const { error500, error404, error400 } = require("./error-handlers");
const { getArticleById, getArticles } = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");
const endpoints = require("./endpoints.json");

const app = express();

app.use(express.json());

app.get("/api", (request, response, next) => {
    response.status(200).send({ endpoints })
})

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.all('*', (request, response, next) => {
    response.status(404).send({ msg: "Not Found"});
    next(err);
})

app.use(error404);

app.use(error400);

app.use(error500);
module.exports = app;