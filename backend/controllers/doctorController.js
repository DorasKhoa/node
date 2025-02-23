const User = require('../models/user.js');
const Order = require('../models/order.js');

exports.getAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const orders = await Order.find({ doctorId })
            .populate('doctorId', 'name')
            .populate('userId', 'name');
        if (!orders) {
            return res.status(404).json({ message: 'Appointment not found!' })
        }
        const response = orders.map(order => ({
            _id: order._id,
            userName: order.userId.name,
            doctorId: order.doctorId.name,
            bookTime: order.bookTime,
            fees: order.fees,
            status: order.status,
            paymentMethod: order.paymentMethod
        }))
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//cancel appointment
exports.cancelAppointment = async (req, res) => {
    const doctorId = req.user.id;
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId).populate('doctorId');
        if (!order) {
            return res.status(404).json({ message: 'Appointment not found!' })
        }

        if (order.doctorId._id.toString() !== doctorId) {
            return res.status(403).json({ message: 'You are not allow to cancel this appointment' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'You can only reject pending appointment' })
        }

        await Order.findByIdAndUpdate(orderId, { status: 'rejected' });
        res.status(200).json({ message: 'Appointment rejected sucessfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//approve appointment
exports.approveAppointment = async (req, res) => {
    const doctorId = req.user.id;
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId).populate('doctorId');
        if (!order) {
            return res.status(404).json({ message: 'Appointment not found!' })
        }

        if (order.doctorId._id.toString() !== doctorId) {
            return res.status(403).json({ message: 'You are not allow to cancel this appointment' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'You can only approved pending appointment' })
        }

        await Order.findByIdAndUpdate(orderId, { status: 'approved' });
        res.status(200).json({ message: 'Appointment approved sucessfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}