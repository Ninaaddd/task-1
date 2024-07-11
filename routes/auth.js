const router = require('express').Router();
const User = require("../models/User")
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


//REGISTER
router.post('/register',async(req,res)=>{
    const newUser= new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
    });
    
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch (err){
        res.status(500).json(err);
    }
    
});


//LOGIN

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credentials!");
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.status(401).json("Wrong Credentials!")
        
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC,
    { expiresIn: "3d"});

        const { password, ...others } = user._doc;


        res.status(200).json({...others,accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});



//FORGET USER PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log("Forgot password request received email: ", req.body);
    console.log("Extracted email:", email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in the database");
            return res.status(404).json({ msg: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\nhttp://${req.headers.host}/reset-password/${token}\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error sending email' });
            }
            res.status(200).json({ msg: 'Password reset email sent' });
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// RESET PASSWORD
router.post('/resetPassword/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const { password, confirmPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        user.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
        user.resetPasswordToken = '';
        user.resetPasswordExpires = Date.now();
        await user.save();

        res.status(200).json({ msg: 'Password has been reset' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router