const Schedule = require('../models/schedule.js');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err));

const seedSchedule = async () => {
    try {
        await Schedule.deleteMany({})

        const schedules = [];
        const times = [
            {start: '08:00', end: '12:00'},
            {start: '13:00', end: '17:00'},
            {start: '18:00', end: '22:00'},
        ];

        let scheduleIndex = 1;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];

            for (let j = 0; j < 3; j++) {
                schedules.push({
                    scheduleIndex: scheduleIndex++,
                    startTime: times[j].start,
                    endTime: times[j].end,
                    date: formattedDate,
                });
            }
        }
        await Schedule.insertMany(schedules);
        console.log('Data seed successfully');
        mongoose.connection.close();
    } catch (error) {
        console.log('Error seeding schedual', error)
        mongoose.connection.close();
    }
};

seedSchedule()