const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    GoogleUniqueId:{
        type:String,
        unique:true,
        sparse:true,
        default:null
    },
    password: {
        type: String,
    },

    shareid:{type:String,unique:true},
    messages:[
        {
            message:String,
            sentAt:Date
        }
    ]

});

module.exports = mongoose.model('User', userSchema);
