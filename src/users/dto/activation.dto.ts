import { IsNotEmpty, IsString } from 'class-validator';

export class ActivationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

