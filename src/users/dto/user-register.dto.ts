import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString({ message: 'password is not set' })
  password: string;

  @IsString({ message: 'name is not set' })
  name: string;
}
