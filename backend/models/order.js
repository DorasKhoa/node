const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bookTime: {type: String, required: true},
    fees: {type: Number, required: true},
    status: {type: String, enum:['pending', 'approved', 'rejected', 'paid', 'canceled'], default: 'pending'},
    paymentMethod: {type:String, enum:['cash', 'card'], default: 'cash'}
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema );