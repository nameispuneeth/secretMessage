const express=require("express");
const User=require("../models/user.model");
const router=express.Router();
const jwt=require("jsonwebtoken");
const {nanoid}=require("nanoid");
const jwtVerification=require("../middlewares/authValidation");

router.use(jwtVerification);

router.get("/fetchuserdetails",async(req,res)=>{
    try{
        const user=await User.findOne({email:req.email});
        if(!user) return res.send({status:'error',error:'User Not Found'});
        const id = user._id.toString();
        const len = id.length;
        const middle10 = id.slice(Math.floor((len - 10) / 2), Math.floor((len - 10) / 2) + 10);
        if(user.shareidexpiryDate!=null && user.shareidexpiryDate<new Date()) return res.send({status:'ok',messages:user.messages,shareid:user.shareid,Expired:true,userId:middle10});
        res.send({status:'ok',messages:user.messages,shareid:user.shareid,userId:middle10})
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})



router.post("/deletemsg",async(req,res)=>{
    const val=req.body.msg;
    try{
        const response=await User.updateOne({email:req.email},{
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

router.get("/changeurl",async (req,res) => {
    try{
        const user=await User.findOne({email:req.email});
        if(!user){
            return res.send({status:'error',error:'User Not Found'});
        }
        let newsharedId=nanoid(10);
        while(await User.findOne({shareid:newsharedId})){
            newsharedId=nanoid(10);
        }
        user.shareid=newsharedId;
        user.shareidexpiryDate=null;
        await user.save();

        return res.send({status:'ok',urlToken:newsharedId});
        
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})


router.post("/tocustomurl",async(req,res)=>{
    const URL=req.body.URL;
    try{
        const dummyuser=await User.findOne({shareid:URL});
        const user=await User.findOne({email:req.email});
        if(!user) return res.send({status:'error',error:'User Not Found'});
        if(dummyuser && dummyuser.username!=user.username) return res.send({status:'error',error:'URL exists. Choose Another.'});
        user.shareid=URL;
        user.shareidexpiryDate=null;
        await user.save();
        return res.send({status:'ok'});
    }catch(e){
        return res.send({status:'error',error:'Network Issues'});
    }
})

router.post("/setexpiry",async(req,res)=>{
    const date=req.body.expiry;
    try{
        const user=await User.findOne({email:req.email});
        if(!user) return res.send({status:'error',error:"User Not Found"});
        user.shareidexpiryDate=date;
        await user.save();
        res.send({status:"ok"});
    }catch(e){
        res.send({status:'error',error:"Network Issues"});
    }
})

module.exports=router;