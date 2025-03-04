const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    scheduleIndex: Number,
    startTime: String,
    endTime: String,
    date: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User', default: null},
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    status: String,
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);