const { fetchArticleById } = require("../models/articles.model");
const {
  fetchCommentsByArticleId,
  createCommentsByArticleId,
  removeCommentByCommentId,
  updateVotesByCommentId,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [fetchCommentsByArticleId(article_id)];

  Promise.all(promises)
    .then((results) => {
      response.status(200).send({ comments: results[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (request, response, next) => {
  const comment = request.body;
  const { article_id } = request.params;

  const promises = [
    fetchArticleById(article_id),
    createCommentsByArticleId(comment, article_id),
  ];

  Promise.all(promises)
    .then((newComment) => {
      response.status(201).send({ comment: newComment[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  updateVotesByCommentId(comment_id, inc_votes)
    .then((updatedComment) => {
      response.status(200).send(updatedComment);
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (request, response, next) => {
  const { comment_id } = request.params;

  removeCommentByCommentId(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
