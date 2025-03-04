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
    center: {type: mongoose.Schema.Types.ObjectId, ref: 'Center', default: null},
    order: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: []}],
    schedule: {type: mongoose.Schema.Types.ObjectId, ref:'Schedule', default: null}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);