const { getTopics } = require("../../controllers/topics.controller");
const { fetchTopics } = require("../../models/topics.model");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkIfTopicExists = (topic) => {
  return fetchTopics()
  .then((listedTopics) => {
    const slugs = listedTopics.map(topic =>
      topic.slug)

    if(!slugs.includes(topic)){
      return Promise.reject({ status: 404, msg: "Topic Not Found" })
    }
    return topic
  })
}