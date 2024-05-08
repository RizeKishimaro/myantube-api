import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { AuthDTO } from "./dto/auth.dto";
import { UserService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async yuriCheck(credentials: AuthDTO) {
    const isItSenpai = this.userService.checkSenpai(credentials);
    if (!isItSenpai) {
      throw new BadRequestException({
        code: 119,
        message: "You're Not Senpai.",
      });
    }
    const token = await this.jwtService.signAsync(
      { pass: true, username: "jacky" },
      { secret: "sha256-hmac" },
    );
    return { statusCode: 200, messaage: "Welcome Senpai", token };
  }
  create(createAuthDto: CreateAuthDto) {
    return "This action adds a new auth";
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
