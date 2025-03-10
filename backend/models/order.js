const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    schedule: {type: mongoose.Schema.Types.ObjectId, ref: 'Schedule'},
    fees: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', default: 'pending'},
    payment: {type: String, enum:['cash','card']}
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema );