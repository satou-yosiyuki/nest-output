import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
  name: string;
  password: string;
};
type PasswordOmitUser = Omit<User, 'password'>;
interface JWTPayload {
  userId: User['id'];
  username: User['name'];
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  // ユーザーを認証する
  async validateUser(
    name: User['name'],
    id: User['id'],
    password: User['password'],
  ): Promise<PasswordOmitUser | null> {
    const user = await this.usersService.findOne(id); // DBからUserを取得

    // DBに保存されているpasswordはハッシュ化されている事を想定しているので、
    // bcryptなどを使ってパスワードを判定する
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user; // パスワード情報を外部に出さないようにする

      return result;
    }

    return null;
  }

  // jwt tokenを返す
  async login(user: PasswordOmitUser) {
    // jwtにつけるPayload情報
    const payload: JwtPayload = { userId: user.id, username: user.name };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  sign() {
    return { access_token: this.jwtService.sign({ isAdmin: true }) };
  }
}
