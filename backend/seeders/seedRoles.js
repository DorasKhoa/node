const Role = require('../models/role.js');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const seedRoles = async () => {
    try {

        const roles = ['admin', 'doctor', 'user'];

        for (let roleName of roles) {
            const existingRole = await Role.findOne({ nameRole: roleName });

            if (!existingRole) {
                await Role.create({ nameRole: roleName });
                console.log(`Role '${roleName}' created`);
            } else {
                console.log(`Role ${roleName} is existing`)
            }
        }

        console.log('Role seeding completed!');
        mongoose.disconnect();
    } catch (error) {
        console.log('Error seeding role', error);
        mongoose.disconnect();
    }
};
seedRoles();