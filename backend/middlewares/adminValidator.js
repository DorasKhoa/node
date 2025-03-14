const {body} = require('express-validator');

exports.addCenter = [
    body('local').notEmpty().withMessage('Fill the local!'),
    body('contact').notEmpty().withMessage('Fill the contact number!')
];

exports.createValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((value) => {
        if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter, one special character and number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter, one special character and number');
        }
        if (!/[0-9]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter, one special character and number')
        }
        return true;
    }),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('Dob').notEmpty().withMessage('Date of birth is required'),
];