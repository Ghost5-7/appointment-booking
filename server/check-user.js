const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'john@example.com' });
        if (!user) {
            console.log('User not found');
        } else {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
            console.log('Password hash in DB:', user.password);
            
            const isMatch = await user.comparePassword('password123');
            console.log('Compare "password123":', isMatch);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
