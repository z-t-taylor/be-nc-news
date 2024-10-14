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
        .then((response) => {
            expect(response.body.msg).toBe("Not Found")
        })
    })
})