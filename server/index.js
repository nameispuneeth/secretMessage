const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');

mongoose.connect('mongodb://localhost:27017/secretMessage').then(()=>{
    console.log('Connected to MongoDB');
}).catch((error)=>{
    console.log(error);
});

app.use(cors());
app.use(express.json());

app.post("/api/signup",async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(user) res.send({status:'error',error:'Email already exists'});
        const newPwd=await bcrypt.hash(password,10);
        const newuser=User.create({username,email,password:newPwd});
        if(newuser) res.send({status:'ok',message:'User created successfully'});
        else res.send({status:'error',error:'Failed to create user'});
    }catch(error){
        res.json({status:"error",error:error.message});
    }
});

app.post("/api/signin",async (req,res) => {
    const {email,password}=req.body;
    try{
        console.log(email,password);
        const user=await User.findOne({email:email});
        console.log(user);
        if(!user) res.send({status:'error',error:'Email Doesnt Exist'});
        const PWD=await bcrypt.compare(password,user.password);
        if(PWD) res.send({status:'ok'});
        else res.send({status:'error',error:"Invalid Credentials"});
    }catch(e){
        res.send({status:'error',error:e.error});
    }
})

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});