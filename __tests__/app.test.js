const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")
const endpoints = require("../endpoints.json")

beforeEach(() => { return seed (data) });
afterAll(() => { return db.end() });

describe("/api", () => {
    it("GET: 200 - responds with an object detailing all the avaliable endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe("/api/topics", () => {
    it("GET - 200, returns an array of all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).not.toBe(0)
            body.topics.forEach(topic => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
        })
    })
    it("GET - 404, responds with an error when given an invalid endpoint", () => {
        return request(app)
        .get("/api/toopicss")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found")
        })
    })
})

describe("/api/articles/:article_id", () => {
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
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
        })
    })
    it("GET - 404, responds with an error for an article_id that is valid but that does not exist on our database", () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found")
        })
    })
    it("GET - 400, responds with an error for an invalid article_id type", () => {
        return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid Data Type")
        })
    })
})