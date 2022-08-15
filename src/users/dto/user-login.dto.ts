import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString({ message: 'password is not set' })
  password: string;
}
