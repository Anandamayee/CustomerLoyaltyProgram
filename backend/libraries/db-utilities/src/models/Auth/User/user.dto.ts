import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsString()
    password :string;

    @IsDate()
    dob: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    contact : string;
}

export class UserDTO {

    @IsNotEmpty()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsPhoneNumber()
    contact : string;

    @IsNotEmpty()
    @IsString()
    password : string;
}