const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    phoneNumber: Number,
    Dob: String,
    fees: {type: Number, default: 0},
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null},
    order: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: []}]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);