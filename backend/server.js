require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./config/db.js');
const userRouter = require('./routes/userRouter.js');
const adminRouter = require('./routes/adminRouter.js');
const doctorRouter = require('./routes/doctorRouter.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req,res) =>{
    res.send('Hello World!');
})

connectDb();

app.use(bodyParser.json());

//api
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctors', doctorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});