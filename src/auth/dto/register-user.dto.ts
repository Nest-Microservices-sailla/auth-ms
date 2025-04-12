import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class RegisterUserDto{

    @IsString()
    @MinLength(3)
    name: string

    @IsString()
    @MinLength(3)
    lastName: string

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

}


