/* eslint-disable prettier/prettier */
import { AppError } from '@errors/AppError';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse { 
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');
    }

    const token = sign({}, '57913d1c7839c2d4b6e26e9b99ba34e3', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: IResponse = {
      token,
      user:{
          name: user.name,
          email: user.email
      }
  }

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
