const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connect to MongoDb successfully!')
    } catch (error) {
        console.error('Failed to connect to MongoDb!', error);
    }
}

module.exports = connectDB;