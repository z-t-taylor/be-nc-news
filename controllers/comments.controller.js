const { fetchArticleById } = require("../models/articles.model")
const { fetchCommentsByArticleId, createCommentsByArticleId } = require("../models/comments.model")

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params

    const promises = [fetchCommentsByArticleId(article_id)]

    if (article_id) {
        promises.push(fetchArticleById(article_id))
    }

    Promise.all(promises)
    .then((results) => {
        response.status(200).send({ comments: results[0] })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentsByArticleId = (request, response, next) => {
    const comment = request.body
    const { article_id } = request.params
    
    const promises = [fetchArticleById(article_id), createCommentsByArticleId( comment, article_id)]

    Promise.all(promises)
    .then((newComment) => {
        response.status(201).send({ comment: newComment[1] })
    })
    .catch((err) => {
        next(err)
    })
}