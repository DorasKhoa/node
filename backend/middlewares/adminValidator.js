const {body} = require('express-validator');

exports.addCenter = [
    body('local').notEmpty().withMessage('Fill the local!'),
    body('contact').notEmpty().withMessage('Fill the contact number!')
];