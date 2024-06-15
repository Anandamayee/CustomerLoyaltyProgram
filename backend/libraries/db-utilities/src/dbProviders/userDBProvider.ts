import mongoose, { Connection, Mongoose, model } from "mongoose";
import { UserSchema } from "../models/Auth/User/user.schema";
import { User } from "../models/Auth/User/user.model";




export class UserDBProvider {

    private readonly models = new Map<String,any>();

    constructor(
        private readonly dbConnection : Mongoose
    ){
        const USER_MODEL = this.dbConnection.model('User',UserSchema);
        USER_MODEL.findOneAndUpdate()
        this.models.set("USER_MODEL",USER_MODEL);
    }

    public async addUser(user : User){
        
        try{
            const UserModel = this.models.get('USER_MODEL');
            const userDetails = UserModel.findOne({email:user.email});
            if(userDetails){
                const data = new UserModel(user);
                return data.save()
            }
            else {
                throw new Error (`${user.email} already exist`)
            }
            
        }
        catch(error){
            throw error
        }
    }

    public async findUser(email:string):Promise<User>{
        try{
            const UserModel = this.models.get('USER_MODEL');
            const user = UserModel.findOne({email:email});
            if(user){
                return user;
            }
            else {
                throw new Error (`${email} not found`)
            }
        }
        catch(error){
            throw error
        }
        
    }

    public async updateUser(user:User):Promise<User>{
        try{
            const UserModel = this.models.get('USER_MODEL');
            const userDetail = UserModel.findOneAndUpdate({email:user.email},user,{new:false});
            if(userDetail){
                return userDetail;
            }
            else {
                throw new Error (`${user.email} not found`)
            }
        }
        catch(error){
            throw error
        }
        
    }
}