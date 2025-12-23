const express=require("express");
const router=express.Router();
const {oauth2Client} = require("../utils/googleClient")
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt=require("jsonwebtoken");
const {nanoid}=require("nanoid");
const SecretCode=process.env.SecretKey;

router.post("/signup",async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(user) return res.send({status:'error',error:'Email already exists'});
        const newPwd=await bcrypt.hash(password,10);
        let newsharedId=nanoid(10);
        while(await User.findOne({shareid:newsharedId})){
            newsharedId=nanoid(10);
        }
        const newuser=User.create({username,email,password:newPwd,shareid:newsharedId});
        if(newuser) res.send({status:'ok',message:'User created successfully'});
        else res.send({status:'error',error:'Failed to create user'});
    }catch(error){
        res.json({status:"error",error:error.message});
    }
});

router.post("/signin",async (req,res) => {
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email:email});
        if(!user) return res.send({status:'error',error:'Email Doesnt Exist'});
        else if(!user.password) return res.send({status:'error',error:"Account registered with Google. Please login with Google."})
        const PWD=await bcrypt.compare(password,user.password);
        if(PWD){
            const token=jwt.sign({email:user.email},SecretCode);
            res.send({status:'ok',token:token,urltoken:user.shareid});
        }
        else res.send({status:'error',error:"Invalid Credentials"});
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})

router.get("/google/:code",async(req,res)=>{
    const code=req.params.code;
    try{
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,{
            method:'GET'
        });
        const data=await userRes.json();
        const {id:googleId,email,name}=data;
        const token=jwt.sign({email:email},SecretCode);
        res.send({status:'ok',token:token});
        let user=await User.findOne({email:email});
        if(user){
            user.GoogleUniqueId=googleId;
            await user.save();
        }else{
            let newsharedId=nanoid(10);
            while(await User.findOne({shareid:newsharedId})){
                newsharedId=nanoid(10);
            }
            const newuser=await User.create({
                email:email,
                GoogleUniqueId:googleId,
                username:name,
                shareid:newsharedId
            });
        }
        
    }catch(e){
        res.send({status:'error',error:'Network Issues'});
    }
})

module.exports=router;