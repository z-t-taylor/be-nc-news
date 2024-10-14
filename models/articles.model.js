const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

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