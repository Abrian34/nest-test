import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsString()
    @IsNotEmpty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    password?: string;
}

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsString()
    @IsNotEmpty()
    password?: string;
}

export class updateUserDTO {
    @IsString()
    @IsNotEmpty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    password?: string;
}