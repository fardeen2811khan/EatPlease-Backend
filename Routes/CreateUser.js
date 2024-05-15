const express = require('express')
require('dotenv').config();
const router = express.Router();
const UserSchema = require('../models/UserSchema');
const bcrypt=require('bcryptjs')
const {body,validationResult}=require("express-validator");
const jwt=require('jsonwebtoken');
const jwtSecretKey=process.env.JWT_SECRET
router.post("/createuser", [body('name','invaid name').isLength({min:5}),body('email','invalid email').isEmail(),body('password','inavlid password').isLength({min:5})], async (req, res) => {

    
        const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const salt=await bcrypt.genSalt(10)
    let securePassword=await bcrypt.hash(req.body.password,salt)
    try {
        await UserSchema.create({
            name: req.body.name,
            password: securePassword,
            email: req.body.email,
            location: req.body.location
        })
        res.json({
            success: true
        });
    } catch (error) {
        console.log(error)
        res.json({
            success: false
        });
    }
})
 
router.post("/loginuser",[body('email','invalid email').isEmail(),body('password','inavlid password').isLength({min:5})], async (req, res) => {

    
    const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
let email=req.body.email;
try {
    const userData=await UserSchema.findOne({email});
    if(!userData){
        return res.status(400).json({errors:"Try with Correct Credentials"})
    }
    const passwordCompare=await bcrypt.compare(req.body.password,userData.password);
    if(!passwordCompare ){
        return res.status(400).json({error:"Try with correctss credentials"})
    }
    const data = {
        user: {
            id: userData.id
        }
    }
    const authToken=jwt.sign(data,jwtSecretKey);
    return res.json({success:true,authToken:authToken})
   
} catch (error) {
    console.log(error)
    res.json({
        success: false
    });
}
})
module.exports=router;