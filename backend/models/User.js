const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    membershipType: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic'
    },
    companyName: {
        type: String,
        default: ''
    },
    companyEmail: {
        type: String,
        default: ''
    },
    telephone: {
        type: String,
        default: ''
    },
    companyDescription: {
        type: String,
        default: ''
    },
    membershipDate: {
        type: Date,
        default: Date.now
    },
    membershipValidity: {
        type: Date,
        default: function() {
            // Set default validity to 1 year from membership date
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
