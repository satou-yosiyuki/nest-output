import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
  name: string;
  password: string;
};

@Injectable()
export class UsersService {
  validateUser = async (id: number, password: string) => {
    const _user = await prisma.user.findUnique({ where: { id } });
    return await bcrypt.compare(password, _user?.password || '');
  };
  findOne = async (id: User['id']): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  };
}
