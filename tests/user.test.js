const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const usersRoutes = require('../routes/users');

// Load environment variables
dotenv.config();

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', usersRoutes);

// Setup and teardown
beforeAll(async () => {
    // Connect to your existing MongoDB instance
    // Use a dedicated test database if possible to avoid affecting your dev/prod data
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fabudget_test';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for testing');
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
});

beforeEach(async () => {
    await User.deleteMany({});
});

// Test registration endpoint
describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(userData.name);
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data).not.toHaveProperty('password');

        // Check if user was actually created in DB
        const dbUser = await User.findById(response.body.data.id);
        expect(dbUser).toBeTruthy();
        expect(dbUser.email).toBe(userData.email);
    });

    it('should return 400 if user already exists', async () => {
        // Create a user first
        await User.create({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'Password123'
        });

        // Try to register with the same email
        const userData = {
            name: 'New User',
            email: 'existing@example.com',
            password: 'Password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
    });

    it('should return 500 on server error', async () => {
        // Mock User.findOne to throw an error
        const originalFindOne = User.findOne;
        User.findOne = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server error');

        // Restore the original implementation
        User.findOne = originalFindOne;
    });

    it('should validate required fields', async () => {
        const testCases = [
            { payload: { email: 'test@example.com', password: 'Password123' }, missingField: 'name' },
            { payload: { name: 'Test User', password: 'Password123' }, missingField: 'email' },
            { payload: { name: 'Test User', email: 'test@example.com' }, missingField: 'password' }
        ];

        for (const testCase of testCases) {
            const response = await request(app)
                .post('/api/users/register')
                .send(testCase.payload)
                .expect(500); // Mongoose validation failures result in 500 in this implementation

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Server error');
        }
    });
});

// Test login endpoint
describe('POST /api/users/login', () => {
    it('should login a user with valid credentials', async () => {
        // Create a test user
        const userData = {
            name: 'Login Test',
            email: 'login@example.com',
            password: 'Password123'
        };
        await User.create(userData);

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: userData.email,
                password: userData.password
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(userData.name);
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 401 for non-existent user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'Password123'
            })
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for incorrect password', async () => {
        // Create a test user
        const userData = {
            name: 'Password Test',
            email: 'password@example.com',
            password: 'Password123'
        };
        await User.create(userData);

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: userData.email,
                password: 'WrongPassword123'
            })
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 500 on server error', async () => {
        // Mock User.findOne to throw an error
        const originalFindOne = User.findOne;
        User.findOne = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'Password123'
            })
            .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server error');

        // Restore the original implementation
        User.findOne = originalFindOne;
    });

    it('should handle missing credentials', async () => {
        const testCases = [
            { payload: { password: 'Password123' }, missing: 'email' },
            { payload: { email: 'test@example.com' }, missing: 'password' },
            { payload: {}, missing: 'both' }
        ];

        for (const testCase of testCases) {
            const response = await request(app)
                .post('/api/users/login')
                .send(testCase.payload)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        }
    });
});

// Test get all users endpoint
describe('GET /api/users', () => {
    it('should return all users', async () => {
        // Create test users
        const users = [
            {
                name: 'User One',
                email: 'one@example.com',
                password: 'Password123'
            },
            {
                name: 'User Two',
                email: 'two@example.com',
                password: 'Password123'
            }
        ];

        await User.create(users);

        const response = await request(app)
            .get('/api/users')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(2);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);

        // Check user fields
        response.body.data.forEach(user => {
            expect(user).toHaveProperty('_id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('createdAt');
            expect(user).toHaveProperty('__v');
            expect(user).not.toHaveProperty('password');
        });
    });

    it('should return an empty array when no users exist', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(0);
        expect(response.body.data).toEqual([]);
    });

    it('should return 500 on server error', async () => {
        // Mock User.find to throw an error
        const originalFind = User.find;
        User.find = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/api/users')
            .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Server error');

        // Restore the original implementation
        User.find = originalFind;
    });
});