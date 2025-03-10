const User = require('../models/user.js');
const Role = require('../models/role.js');
const Order = require('../models/order.js');
const Schedule = require ('../models/schedule.js');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtHelper.js');

//user register
exports.register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, phoneNumber, Dob } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = await Role.findOne({ nameRole: 'user' })

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            phoneNumber,
            Dob,
            role: userRole._id
        });

        const savedUser = await newUser.save();

        const userResponse = await User.findById(savedUser._id).populate('role', 'nameRole -_id').select('-password');

        res.status(201).json({ message: 'User register successfully!', userResponse });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//user login
exports.login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'Email or password is incorrect!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email or password is incorrect!' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({ message: 'Login successfully!', accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//get appointment
exports.getAppointment = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        .select('schedule -_id')
        .populate('schedule', '-_id -scheduleIndex')
        if(!user) {
            return res.status(404).json({message: 'User not found!'});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//booking appointment
exports.bookingAppointment = async (req, res) => {
    const scheduleId = req.params.id
    const userId = req.user.id
    try {
        const schedule = await Schedule.findById(scheduleId);
        if(!schedule) {
            return res.status(404).json({message: 'Schedule not found'});
        }
        if(schedule.userId) {
            return res.status(400).json({message: 'Schedule booked by another user'});
        }
        if(!schedule.doctorId) {
            return res.status(400).json({message: 'Schedule have no doctor, failed to book'});
        }
        
        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, {$set: {userId}}, {new: true});
        await User.findByIdAndUpdate(userId, {$push: {schedule: scheduleId}});
        res.status(200).json({message: 'Shedule booked successfully!', updatedSchedule})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//cancel appointment
exports.cancelAppointment = async (req, res) => {
    const scheduleId = req.params.id;
    const userId = req.user.id;
    try {
        const schedule = await Schedule.findById(scheduleId);
        if(!schedule) {
            return res.status(404).json({message: 'Schedule not found!'});
        }
        if(!schedule.userId) {
            return res.status(400).json({message: `Schedule hadn't book, failed to cancelled`})
        }
        if(!userId || userId.toString() !== schedule.userId.toString()) {
            return res.status(403).json({message: 'You are not allow to cancel this appointment!'});
        }

        const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, {$set: {userId: null}}, {new: true});
        await User.findByIdAndUpdate(userId, {$pull: {schedule: scheduleId}});
        res.status(200).json({message: 'Appointment cancelled successfully!', updatedSchedule});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
