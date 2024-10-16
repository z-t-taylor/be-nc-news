const { fetchArticleById, fetchArticles, updateVotesByArticleId } = require("../models/articles.model")

exports.getArticles = (request, response, next) => {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotes = (request, response, next) => {
    const upDateVotes = request.body;
    const { article_id } = request.params;
    
    updateVotesByArticleId(article_id, upDateVotes)
    .then((articleUpdated) => {
        response.status(200).send(articleUpdated)
    })
    .catch((err) => {
        next(err)
    })
}