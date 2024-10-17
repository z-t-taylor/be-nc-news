const { response } = require("../app");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Not Found" });
          }
        return db.query(`
            SELECT * FROM comments 
            WHERE article_id = $1
            ORDER BY created_at;`, [article_id])
    })
    .then(({ rows }) => {
            return rows
    })
}

exports.createCommentsByArticleId = (comment, article_id) => {
    const { username, body } = comment

    if(Object.keys(body).length === 0 || Object.keys(username).length === 0){
        return Promise.reject({ status: 400, msg: "Bad Request"})
    }
    
    return db.query(`
        INSERT INTO comments (author, body, article_id) 
        VALUES ($1, $2, $3)
        RETURNING *;`, [username, body, article_id]
    )
    .then(({ rows }) => {
        return rows[0]
    })    
}

exports.removeCommentByCommentId = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [comment_id]
    )
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
        return rows
    })
}