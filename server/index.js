const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');
const jwt=require("jsonwebtoken");
const {nanoid}=require("nanoid");
require("dotenv").config()

mongoose.connect('mongodb://localhost:27017/secretMessage').then(()=>{
    console.log('Connected to MongoDB');
}).catch((error)=>{
    console.log(error);
});

app.use(cors());
app.use(express.json());
const SecretCode=process.env.SecretKey;

app.post("/api/signup",async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(user) res.send({status:'error',error:'Email already exists'});
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

app.post("/api/signin",async (req,res) => {
    const {email,password}=req.body;
    console.log(email,password);
    try{
        const user=await User.findOne({email:email});
        if(!user) res.send({status:'error',error:'Email Doesnt Exist'});
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

app.get("/api/ValidToken/:token",async(req,res)=>{
    const token=req.params.token;
    try{
        const user=await User.findOne({shareid:token});
        if(!user) return res.send({status:'error',error:"Not A Valid URL"});
        res.send({status:'ok',name:user.username});
    }catch(e){
        res.send({status:'error',error:"Network Issue"});
    }
})

app.get("/api/FetchUserDetails",async(req,res)=>{
    const token=req.headers.authorization;
    try{
        const data=jwt.verify(token,SecretCode);
        const user=await User.findOne({email:data.email});
        if(!user) return res.send({status:'error',error:'User Not Found'});
        res.send({status:'ok',messages:user.messages,shareid:user.shareid})
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})

app.post("/api/sendMessage/:token",async(req,res)=>{
    const sharedid=req.params.token;
    const message=req.body.message;
    try{
        const user=await User.findOne({shareid:sharedid});

        if(!user) return res.send({status:'error',error:"Not A Valid URL"});
        user.messages.push({
            message:message,
            sentAt:Date.now()
        })
        await user.save()
        res.send({status:'ok'});
    }catch(e){
        res.send({status:'error',error:'Network Issues'})
    }
})

app.post("/api/DeleteMSG",async(req,res)=>{
    const val=req.body.msg;
    const token=req.headers.authorization;
    try{
        const decoded=jwt.verify(token,SecretCode);
        const response=await User.updateOne({email:decoded.email},{
            $pull:{
                messages:{
                    message:val.message,
                    sentAt:val.sentAt
                }
            }
        })
        res.send({status:'ok'})
    }catch(e){
        res.send({status:'error',error:'Network Issues'});
    }
});

app.get("/api/ChangeURL",async (req,res) => {
    const token=req.headers.authorization;
    try{
        const decoded=jwt.verify(token,SecretCode);
        const user=await User.findOne({email:decoded.email});
        if(!user){
            return res.send({status:'error',error:'User Not Found'});
        }
        let newsharedId=nanoid(10);
        while(await User.findOne({shareid:newsharedId})){
            newsharedId=nanoid(10);
        }
        user.shareid=newsharedId;
        user.messages=[];
        await user.save();
        return res.send({status:'ok',urlToken:newsharedId});
        
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});