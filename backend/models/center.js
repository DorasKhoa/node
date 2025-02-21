const mongoose = require('mongoose')

const centerSchema = new mongoose.Schema({
    local: String,
    contact: Number,
    doctors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
}, {timestamps:true});

module.exports = mongoose.model('Center', centerSchema);