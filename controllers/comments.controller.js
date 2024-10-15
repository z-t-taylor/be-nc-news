const { fetchArticleById } = require("../models/articles.model")
const { fetchCommentsByArticleId } = require("../models/comments.model")

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