const Role = require('../models/role.js');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const seedRoles = async () => {
    try {

        const roles = ['admin', 'doctor', 'user'];

        for (let nameRole of roles) {
            const existingRole = await Role.findOne({ nameRole });

            if (!existingRole) {
                await Role.create({ nameRole });
                console.log(`Role '${nameRole}' created`);
            } else {
                console.log(`Role ${nameRole} is existing`)
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