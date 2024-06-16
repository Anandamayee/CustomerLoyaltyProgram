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
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    password :string;

    @ApiProperty()
    @IsDate()
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