const db = require("../db/connection");

exports.fetchArticles = () => {
    return db.query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON comments.article_id = articles.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {
            rows.forEach(row => {
                row.comment_count = parseInt(row.comment_count, 10)
            })
            return rows
        })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`
        SELECT title, topic, author, body, created_at, votes, article_img_url FROM articles
        WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0){
                return Promise.reject({ status: 404, msg: "Not Found"});
            }
            return rows[0]
        })
}