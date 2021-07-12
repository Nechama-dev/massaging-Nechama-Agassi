import mongoose from 'mongoose'
const { Schema, model } = mongoose

const UserSchema = new Schema({
    userName   : { type : String, required : true },
    password    : { type : String, required : true },
    role       : { type : String },
}, {timestamps:true});
  
export default model('user',UserSchema);