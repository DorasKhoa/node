const { validationResult } = require('express-validator');
const Center = require('../models/center.js');
const User = require('../models/user.js');
const Role = require('../models/role.js')
const bcrypt = require('bcrypt');

//add center
exports.createCenter = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { local, contact } = req.body
    try {
        const existingCenter = await Center.findOne({ local });
        if (existingCenter) {
            return res.status(400).json({ message: 'Center already exist!' });
        }

        const newCenter = new Center({
            local,
            contact,
            doctors: []
        })

        const savedCenter = await newCenter.save()

        const centerResponse = {
            local: savedCenter.local,
            contact: savedCenter.contact
        }

        res.status(201).json({ message: 'Center create successfully!', centerResponse })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

//get all centers
exports.getAllCenters = async (req, res) => {
    try {
        const centers = await Center.find().populate('doctors', 'name phoneNumber');
        res.status(200).json({ centers })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get center with id
exports.getCenterById = async (req, res) => {
    try {
        const center = await Center.findById(req.params.id);
        if (!center) {
            return res.status(404).json({ message: 'Center not found!' });
        }
        res.status(200).json({ center });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update center
exports.updateCenter = async (req, res) => {
    const { local, contact } = req.body
    try {
        const updatedCenter = await Center.findByIdAndUpdate(
            req.params.id,
            { local, contact },
            { new: true }
        )

        if (!updatedCenter) {
            return res.status(404).json({ message: 'Center not found!' })
        }
        res.status(200).json({ message: 'Center updated successfully!', updatedCenter })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//delete center
exports.deleteCenter = async (req, res) => {
    try {
        const deletedCenter = await Center.findByIdAndDelete(req.params.id)
        if (!deletedCenter) {
            return res.status(404).json({ message: 'Center not found!' });
        }
        res.status(200).json({ message: 'Center deleted successfully!', deletedCenter })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

//create account
exports.createAccount = async (req, res) => {
    const { name, email, password, address, phoneNumber, Dob, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const roleData = await Role.findOne({ nameRole: role });
        if (!roleData) {
            return res.status(404).json({ message: 'Invalid role!' })
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            phoneNumber,
            Dob,
            role: roleData._id
        })

        const savedUser = await newUser.save()

        const userResponse = await User.findById(savedUser._id).populate('role', 'nameRole -_id').select('-password')

        res.status(201).json({ message: `Create ${userResponse.role} successfully!`, userResponse })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//get accounts
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await User.find().select('-password');
        if (!accounts) {
            return res.status(404).json({ message: 'User not found!' })
        }
        res.status(200).json(accounts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//get account by id
exports.getAccountById = async (req, res) => {
    try {
        const account = await User.findById(req.params.id).select('-password');
        if (!account) {
            return res.status(404).json({ message: 'User not found!' })
        }
        res.status(200).json(account)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//update account
exports.updateAccount = async (req, res) => {
    const { name, address, phoneNumber, Dob, role, fees } = req.body
    try {
        const roleData = await Role.findOne({ nameRole: role })
        if (!roleData) {
            return res.status(404).json({ message: 'Invalid Role!' })
        }

        const updatedAccount = await User.findByIdAndUpdate(
            req.params.id,
            { name, address, phoneNumber, Dob, role: roleData._id, fees },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'Update successfully!', updatedAccount })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//delete account
exports.deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await User.findByIdAndDelete(req.params.id);
        if (!deletedAccount) {
            return res.status(404).json({ message: 'User not found!' })
        }
        res.status(200).json({ message: 'Account deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// add doctor to center
exports.assignDoctorToCenter = async (req, res) => {
    const { centerId, doctorId } = req.body;
    try {

        const center = await Center.findById(centerId);
        if (!center) {
            return res.status(404).json({ message: 'Center not found!' });
        }

        const doctor = await User.findById(doctorId).populate('role');
        if (!doctor || doctor.role.nameRole !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found!' });
        }

        const oldCenter = await Center.findOne({doctors: doctorId})
        if(oldCenter) {
            await Center.findByIdAndUpdate(oldCenter._id, {$pull: {doctors: doctorId}});
        }

        if (center.doctors.includes(doctorId)) {
            return res.status(400).json({ message: 'Doctor already assign to this center!' });
        }


        center.doctors.push(doctorId);
        await center.save();

        res.status(200).json({ message: 'Doctor assign successfully!', center });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.removeDoctorFromCenter = async (req, res) => {
    const {doctorId} = req.body;
    try {
        const center = await Center.findOne({doctors: doctorId});
        if(!center) {
            return res.status(404).json({message: 'Doctor is not assigned to any center!'});
        }
        await Center.findByIdAndUpdate(center.id, {$pull: {doctors: doctorId}})
        res.status(200).json({message: 'Doctor removed successfully'});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}