import { Schema } from "mongoose";
import { Role } from "./Role.enum";


export const UserSchema = new Schema({
    name :{
        type:String,
        require:true,
    },
    email:{
        type: String,
        require:true,
        unique:true,
    },
    password:{
        type: String,
        require:true,
    },
    DOB:{
        type:String,
        require:false
    },
    contact:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        require:false
    },
    updatedAt:{
        type:Date,
        require:false
    },
    role:{
        type:String,
        enum:Role,
        require:true
    }

})