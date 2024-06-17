import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';

export class UserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name : string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*\d)(?=.*[@$!%*#?&])(?=.*[A-Z])(?=.*[a-z]).{8,}$/, { 
        message: `Password ahould contain atleast 1 uppercase ,
                  1 lowercase,
                  1 special character amoung @$!%*#?&
                  1 number
                  and minimum 8 characters long` })
    password :string;

    @ApiProperty()
    @IsString()
    dob: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber()
    contact : string;
}

export class CreateUserDTO extends UserDTO{
    @IsNotEmpty()
    @IsDate()
    createdAt : Date;
}

export class UpdateUserDTO extends UserDTO{
    @IsNotEmpty()
    @IsDate()
    updateddAt : Date;
}


export class UserLoginDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @ApiProperty()
    @IsPhoneNumber()
    contact : string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password : string;
}