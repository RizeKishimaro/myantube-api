// user/dtos/user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name:string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// user/dtos/activation.dto.ts
