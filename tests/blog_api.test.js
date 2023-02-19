const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

describe('blogs are returned properly', () => {
    test('blogs are returned in JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('enough blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

describe('blogs contain wanted content', () => {
    test('blogs contain id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('adding a blog works', () => {
    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(response.body[initialBlogs.length].title).toContain(
            'Canonical string reduction'
        )
    })
    test('likes default to 0', async () => {
        const newBlog = {
            title: "test blog",
            author: "me",
            url: "no"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const response = await api.get('/api/blogs')
        expect(response.body[initialBlogs.length].likes).toEqual(0)
    })
    test('bad request if an important field is empty', async () => {
        const newBlog = {
            author: "me",
            url: "no"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('deleting a blog works', () => {
    test('blog is properly deleted', async () => {
        const c = initialBlogs.length
        await api
            .delete(`/api/blogs/${initialBlogs[0]._id}`)
            .expect(204)
        const response = await api.get('/api/blogs')
        expect(response.body.length).toEqual(c - 1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})