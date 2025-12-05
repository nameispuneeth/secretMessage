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
    password: {
        type: String,
        required: true
    },
    shareid:{type:String,unique:true},
    messages:[
        {
            title:String,
            message:String,
            sentAt:Date
        }
    ]

});

module.exports = mongoose.model('User', userSchema);
