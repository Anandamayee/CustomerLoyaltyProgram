import { ApiProperty } from "@nestjs/swagger";
import { Role } from "./Role.enum";



export class User{
    @ApiProperty()
    _id:string;

    @ApiProperty()
    name:string;

    @ApiProperty()
    email:string;

    @ApiProperty()
    role?:Role;

    @ApiProperty()
    contact:string;

    password:string;

    @ApiProperty()
    DOB?:Date;

    @ApiProperty()
    createdAt?:string;
    
    @ApiProperty()
    updatedAt?:string;
}