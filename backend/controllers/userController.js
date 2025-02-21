const User = require('../models/user.js');
const Role = require('../models/role.js');
const Order = require('../models/order.js');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const {generateAccessToken, generateRefreshToken} = require('../utils/jwtHelper.js');
const order = require('../models/order.js');

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
    try {
        const userId = req.user.id
        const order = await Order.find({userId})
        .populate('doctorId', 'name -_id')
        .populate('userId', 'name -_id');
        if(!order) {
            return res.status(404).json({message: 'No appointments found!'})
        }
        res.status(200).json(orderResponse);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//booking appointment
exports.bookingAppointment = async (req, res) => {
    const {doctorId, bookTime} = req.body;
    try {
        const doctor = await User.findById(doctorId).populate('role');
        if(!doctor || doctor.role.nameRole !== 'doctor') {
            return res.status(404).json({message: 'Doctor not found!'});
        }

        const existingOrder = await Order.findOne({
            doctorId: doctorId,
            bookTime: bookTime
        })
        if(existingOrder) {
            return res.status(409).json({message: 'The doctor is already booked at this time. Please choose another time.'})
        }

        const newOrder = await Order.create({
            userId: req.user.id,
            doctorId: doctorId,
            bookTime: bookTime,
            fees: doctor.fees,
        })

        await User.findByIdAndUpdate(req.user.id, {$push: {order: newOrder._id}});
        await User.findByIdAndUpdate(doctorId, {$push: {order: newOrder._id}});

        res.status(200).json({message: 'Appointment book successfully!', newOrder});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}
