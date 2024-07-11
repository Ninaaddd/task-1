const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');


dotenv.config();
//DB Connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("DB Connection Successful!"))
.catch((err)=>{
    console.log("Error is: " + err);
})


app.use(express.json());
//routes
app.use('/api/auth',authRoute);



app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend Server is running!");
})