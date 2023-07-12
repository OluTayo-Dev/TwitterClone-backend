import mongoose from "mongoose";



const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, unique: true,  required: true},
    password: { type: String, minLength:8,  required: true}
    
});


const signup_model = mongoose.model("User", UserSchema);

export default signup_model;