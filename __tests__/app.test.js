const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api", () => {
  it("GET: 200 - responds with an object detailing all the avaliable endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/topics", () => {
  it("GET - 200, returns an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("GET - 200, returns an array of objects with their properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  it("GET - 200, return an array of articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("Status 200 - Sorting queries - GET /api/articles", () => {
    it("GET - 200, responds with an array of articles sorted by the default 'created_at' but queried in ascending order", () => {
      return request(app)
        .get("/api/articles?order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at");
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'title' in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=DESC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: true });
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'title' in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title");
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'topic' in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order_by=DESC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'topic'in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic");
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'author' in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order_by=DESC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", { descending: true });
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'author' and in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author");
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'votes' in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order_by=DESC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", { descending: true });
        });
    });
    it("GET - 200, responds with an array of articles sorted by 'votes' and in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes");
        });
    });
  });
  describe("Error - Sorting queries - GET /api/articles", () => {
    it("GET - 400, responds with an error when invalid sort_by is queried and not greenlisted", () => {
      return request(app)
        .get("/api/articles?sort_by=books")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("GET - 400, responds with an error when invalid order_by is queried", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order_by=horizontal")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("GET - 200, responds with an array of articles with the default sorting ('created_at') when 'sort_by' is misspelt in the query", () => {
      return request(app)
        .get("/api/articles?sNortby=author&order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at");
        });
    });
    it("GET - 200, responds with an array of articles in the default order ('DESC') when 'order_by' is misspelt in the query", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&otterby=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        });
    });
  });
  describe("Status 200 - Topic filter - GET /api/articles", () => {
    it("GET - 200, takes a topic query and responds with a filtered array of topics based on then given input", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).not.toBe(0);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    it("GET - 200, responds with an empty array when a queried topic does exist on the database but there are no articles currently assigned to it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topic)).toBe(true);
          expect(body.topic).toHaveLength(0);
        });
    });
    it("GET - 404, responds with an error when topic does not exist on the database", () => {
      return request(app)
        .get("/api/articles?topic=sandcastles")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic Not Found");
        });
    });
  });
});

describe("GET /api/users", () => {
  it("GET - 200, returns an array of all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).not.toBe(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("GET - 200, returns the correct article as directed to by the parametric endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });
  it("GET - 404, responds with an error for an article_id that is valid but that does not exist on our database", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("GET - 400, responds with an error for an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
  describe("Comment count - GET /api/articles/:article_id", () => {
    it("GET- 200, responds with an article with 'comment_count' property added", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("comment_count");
          expect(typeof body.article.comment_count).toBe("number");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("GET - 200, returns an array of all the comments associated with a valid article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).not.toBe(0);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  it("GET - 200, returns an array of comments with properties of the expected types from a valid article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).not.toBe(0);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  it("GET - 200, returns an array of comments ordered by most recent first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at");
      });
  });
  it("GET - 200, returns an empty array when given a valid article_id with no associated comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments).toHaveLength(0);
      });
  });
  it("GET - 404, responds with an error when given article_id type that is valid but does not exist on the database", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("GET - 400, responds with an error when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("POST - 201, accepts a request and returns a newly posted comment associated with article_id with the correct properties plus an extra property added by user", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This bread needs no spread.",
      extraProp: true,
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author", newComment.username);
        expect(comment).toHaveProperty("body", newComment.body);
        expect(comment).toHaveProperty("article_id", 9);
      });
  });
  it("POST - 201, accepts a request and returns with a new comment which has the correct property types", () => {
    const newComment = {
      username: "lurker",
      body: "Nothing to add.",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
      });
  });
  it("POST - 404, responds with an error when an invalid article_id that is not present on the database is given", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This consists of letters.",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("POST - 400, responds with an error when given an invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "I see everything..",
    };
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
  it("POST - 404, responds with an error when an invalid username is used that does not exist on the database", () => {
    const newComment = {
      username: "total-biscuit",
      body: "Nothing worse than a soggy biscuit that drops into a freshly brewed cuppa",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("POST - 400, responds with an error when missing a required field", () => {
    const newComment = {
      username: "lurker",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("PATCH - 200, responds with request article with an increase in votes on an article", () => {
    const upDateVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(upDateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(101);
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("topic");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("body");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("article_img_url");
      });
  });
  it("PATCH - 200, responds with an decrease in votes on an article", () => {
    const upDateVotes = {
      inc_votes: -99,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(upDateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(1);
      });
  });
  it("PATCH - 200, responds with an article that exists on the database, originally with the votes at 0, remaining at 0 when new votes are a negative integer", () => {
    const upDateVotes = {
      inc_votes: -2,
    };
    return request(app)
      .patch("/api/articles/7")
      .send(upDateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(0);
      });
  });
  it("PATCH - 404, responds with an error when given an valid article_id but does not exist on the database", () => {
    const upDateVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(upDateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("PATCH - 400, responds with an error when given an invalid article_id", () => {
    const upDateVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/not-an-endpoint")
      .send(upDateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
  it("PATCH - 400, responds with an error when given an invalid data type passed to inc_votes", () => {
    const upDateVotes = {
      inc_votes: true,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(upDateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("DELETE - 204, responds by deleting a comment corresponding by a comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("DELETE - 404, responds with an error when a queried comment_id is a valid data type but does not exist on the database", () => {
    return request(app)
      .delete("/api/comments/4444")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("DELETE - 400, responds with an error when a queried comment_id is an invalid data type", () => {
    return request(app)
      .delete("/api/comments/noTtHEriGhtDaTA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
});

describe.only("PATCH /api/comments/:comment_id", () => {
  it("PATCH - 200, responds to requested comment with an increase in votes", () => {
    const upDateVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(upDateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(17);
      });
  });
  it("PATCH - 200, responds to requested comment with an decrease in votes", () => {
    const upDateVotes = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(upDateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(15);
      });
  });
  it("PATCH - 400, responds with an error when incorrect data type is inputted", () => {
    const upDateVotes = {
      inc_votes: "one",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(upDateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });
  it("PATCH - 404, responds with an error when given an valid article_id but does not exist on the database", () => {
    const upDateVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/9999")
      .send(upDateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});

describe("All bad URLs", () => {
  it("GET - 404, responds with an error when given an invalid endpoint", () => {
    return request(app)
      .get("/api/inVAlIDenDpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
