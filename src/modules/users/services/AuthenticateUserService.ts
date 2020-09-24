import { sign } from 'jsonwebtoken';
import authConig from '@config/auth';

import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '../repositories/iUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect Email/password combination', 401);
        }

        const passwordMached = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMached) {
            throw new AppError('Incorrect Email/password combination', 401);
        }

        const { secret, expiresIn } = authConig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
