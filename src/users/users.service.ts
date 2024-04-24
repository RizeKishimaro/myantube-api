import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  checkSenpai(credentials: { username: string; password: string }) {
    const { username, password } = credentials;
    const users = [{ name: "haki", password: "miku" }];
    return users.find(
      (user) => user.name === username && user.password === password,
    );
  }
}
