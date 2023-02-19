const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
    {
        username: "testi",
        name: "test man",
        password: "123456",
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
})

describe('users are returned properly', () => {
    test('users are returned in JSON', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('enough users are returned', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(initialUsers.length)
    })
})

describe('adding a user works', () => {
    test('a valid user can be added ', async () => {
        const newUser = {
            username: "testi2",
            name: "test lady",
            password: "654321",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        expect(response.body).toHaveLength(initialUsers.length + 1)
        expect(response.body[initialUsers.length].name).toContain(
            'test lady'
        )
    })
    test('bad request if an important field is empty', async () => {
        const newUser = {
            username: "testi",
            name: "test man",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
    test('bad request if username taken', async () => {
        const newUser = {
            username: "testi",
            name: "test lady 2",
            password: "paasssaas",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})