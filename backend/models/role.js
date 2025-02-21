const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    nameRole: String
}, { timestamps: true })

module.exports = mongoose.model('Role', roleSchema);