const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName: {type:String, reuired:true},
    lastName:{type:String, required:true},
    email:{
        type:String,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        unique:true,
        required:true},
    password:{type:String, required:true},
    mobile: {type:String, required:true, match: /^[0-9]{10}$/, unique:true},
    video :{type: String, required: false},
    userRole: {
        type: String,
        default: "admin",
        enum: ["user", "admin"]
    }
   
    
})

module.exports = mongoose.model('user', userSchema);