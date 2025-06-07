const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }        // Check if password matches
        const isMatch = await user.authenticate(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Since we're not using JWT for now, just return user data
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all users (admin only in real implementation)
// @route   GET /api/users
// @access  Public (would be Private/Admin in real app)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');

        // Map users to include __v field and ensure it's a non-negative integer
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            __v: user.__v || 0 // Ensure __v exists and is at least 0
        }));

        res.status(200).json({
            success: true,
            count: formattedUsers.length,
            data: formattedUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get user by email
// @route   GET /api/users/email/:email
// @access  Public
// Example usage: GET /api/users/email/collinscodes@gmail.com
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                __v: user.__v || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;