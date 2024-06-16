import { Schema } from "mongoose";
import { Role } from "./Role.enum";
import { User } from "./user.model";


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
        type:Date,
        require:false
    },
    contact:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:Role,
        require:false
    }

})