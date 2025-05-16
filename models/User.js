const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Removed jwt require

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email cannot be more than 255 characters'],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [16, 'Password cannot be more than 16 characters'],
        validate: {
            validator: function (value) {
                // Password must contain at least one uppercase letter, one lowercase letter, and one number
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        },
        select: false
    }, resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware for data sanitization and password encryption
UserSchema.pre('save', async function (next) {
    // Sanitize inputs
    if (this.isModified('name')) {
        // Sanitize name - remove extra spaces and ensure proper capitalization
        this.name = this.name
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ');
    }

    // Only hash password if it has been modified or is new
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Simple authentication method without JWT
UserSchema.methods.authenticate = async function (enteredPassword) {
    if (!enteredPassword || typeof enteredPassword !== 'string') {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for password confirmation
UserSchema.virtual('passwordConfirm')
    .set(function (value) {
        this._passwordConfirm = value;
    })
    .get(function () {
        return this._passwordConfirm;
    });

// Validate password confirmation matches password
UserSchema.pre('validate', function (next) {
    if (this.isModified('password') && this._passwordConfirm !== undefined) {
        if (this.password !== this._passwordConfirm) {
            this.invalidate('passwordConfirm', 'Passwords do not match');
        }
    }
    next();
});

// Email validation - check if email exists
UserSchema.statics.emailExists = async function (email) {
    if (!email) return false;
    const user = await this.findOne({ email: email.toLowerCase().trim() });
    return !!user;
};

module.exports = mongoose.model('User', UserSchema);