const express = require("express");
const { error500, error400, customError, error404 } = require("./error-handlers");
const { getTopics } = require("./controllers/topics.controller");   
const { getArticleById, getArticles, patchArticleVotes } = require("./controllers/articles.controller");
const { getCommentsByArticleId, postCommentsByArticleId, deleteCommentByCommentId } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const endpoints = require("./endpoints.json");

const app = express();

app.use(express.json());

app.get("/api", (request, response, next) => {
    response.status(200).send({ endpoints })
})

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId)

app.all('*', (request, response, next) => {
    response.status(404).send({ msg: "Not Found"});
    next(err);
})

app.use(customError);

app.use(error400);

app.use(error404);

app.use(error500);

module.exports = app;