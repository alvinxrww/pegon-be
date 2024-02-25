import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: String;

    @IsEmail()
    @IsNotEmpty()
    email: String;

    @IsEnum(["admin", "user"], {
        message: "valid role required"
    })
    role: "admin" | "user";
}
