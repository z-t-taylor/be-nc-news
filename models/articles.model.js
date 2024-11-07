const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = "created_at", order_by = "DESC") => {

    const validSortQueries = [ "created_at", "title", "topic", "author", "votes", "comment_count" ];
    const validOrderQueries = [ "DESC", "ASC" ]

    if(!validSortQueries.includes(sort_by) || !validOrderQueries.includes(order_by)){
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    let filteredTopic = [];
    let topicQuery = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles
        LEFT JOIN comments 
        ON comments.article_id = articles.article_id`

    if(topic){
        topicQuery += ` WHERE topic = $1`;
        filteredTopic.push(topic);
    }

    topicQuery += `
        GROUP BY articles.article_id 
        ORDER BY ${sort_by} ${order_by};`

    return db.query(topicQuery, filteredTopic)
.then(({ rows }) => {
    return rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`
        SELECT articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, articles.article_id,
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return rows[0]
    })
}

exports.updateVotesByArticleId = (article_id, upDateVotes) => {
    const { inc_votes: newVotes } = upDateVotes
   
    return db.query(`
        SELECT votes FROM articles
        WHERE article_id = $1`, [article_id]
    )
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }

        if(typeof newVotes !== "number"){
            return Promise.reject({ status: 400, msg: "Invalid Data Type"})
        }
        
        let sum = rows[0].votes + newVotes;
        
        return db.query(`
            UPDATE articles
            SET votes = GREATEST($2, 0)
            WHERE article_id = $1
            RETURNING title, topic, author, body, created_at, votes, article_img_url;`, [article_id, sum])
    })
    .then(({ rows }) => {
        return rows[0]
    })
}