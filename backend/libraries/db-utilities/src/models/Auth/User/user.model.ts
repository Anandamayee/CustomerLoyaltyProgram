import { Role } from "./Role.enum";



export class User{
    _id:string;
    name:string;
    email:string;
    role?:Role;
    contact:string;
    DOB?:string;
}