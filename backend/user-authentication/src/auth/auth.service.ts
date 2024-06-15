import { Injectable } from "@nestjs/common";
import { Request } from "express";
import {User,CreateUserDTO,DBConnectionProvider} from 'db-utilities';

@Injectable()
export class AuthService {
    private userDBProvider;
    constructor(private readonly dbConnectionProvider: DBConnectionProvider){}
    public async createUser(
        request:Request,
        userDetails:CreateUserDTO
    ):Promise<User>{
        try{
            this.userDBProvider = await this.dbConnectionProvider.getDBConnection('User');
            return this.userDBProvider.createUser(userDetails);
        }
        catch(error){
            console.log("error " ,error);
            
        }
         

    }

    public async getUser(
        request:Request,
        email:string
    ):Promise<User>{
        try{
            this.userDBProvider = await this.dbConnectionProvider.getDBConnection('User');
            return this.userDBProvider.findUser(email);
        }
        catch(error){
            console.log("error " ,error);
            
        }

    }

    public async updateUser(
        request:Request,
        user:CreateUserDTO
    ):Promise<User>{
        try{
            this.userDBProvider = await this.dbConnectionProvider.getDBConnection('User');
            return this.userDBProvider.findUser(email);
        }
        catch(error){
            console.log("error " ,error);
            
        }
         

    }

  
}