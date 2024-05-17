import { IsNotEmpty } from "class-validator";

 export class UserAuthDTO{
  @IsNotEmpty()
   email: string;
   @IsNotEmpty()
   password: string;
 }
