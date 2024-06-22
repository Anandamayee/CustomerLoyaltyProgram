import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MinLength, ValidateIf } from 'class-validator';

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
    @ValidateIf((o) => !o.isOAuth)
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
    @IsOptional()
    dob: string;

    @ApiProperty()
    @ValidateIf((o) => !o.isOAuth)
    @IsPhoneNumber()
    contact : string;

    @ApiProperty()
    @IsOptional()
    isOAuth :boolean
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
    @ValidateIf(o => o.email === undefined && o.phone === undefined)
    @IsEmail()
    email : string;

    @ApiProperty()
    @IsPhoneNumber()
    @ValidateIf(o => o.email === undefined && o.phone === undefined)
    contact : string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password : string;
}