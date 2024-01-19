const mongoose = require('mongoose');
const {Schema} = mongoose;
const userSchema = new Schema({
    phone:{
        type:String,
        trim:true,
        required:true
    },
    activated:{
        type:Boolean,
        required:false,
        default:false
    },
    name:{
        type:String,
        required:false
    },
    avatar:{
        type:String,
        required:false,
        /*This is added here to ensure that whenever avatar is called from the database the BASE_URL is appended to avatar
        url and then send it as frontend can't render it without that*/
        get : (avatar) => {
            if(avatar){
                return `${process.env.BASE_URL}${avatar}`;
            } 
            return avatar;
        },
    }
},{
    timestamps: true,
    toJSON : {getters:true},
});
module.exports = mongoose.model('User',userSchema);