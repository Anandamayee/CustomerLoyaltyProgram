import mongoose from "mongoose";
import { Role } from "./Role.enum";


export const UserSchema = new mongoose.Schema({

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
    Role:{
        type:Role,
        require:false
    }

})