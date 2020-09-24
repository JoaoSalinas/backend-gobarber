import path from 'path';
import fs from 'fs';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/iUsersRepository';
import IStorageProvider from '@shared/container/provider/StorageProvider/models/IStorageProvider';

interface Request {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('StoregeProvider')
        private storageProvider: IStorageProvider
    ) {}

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated user can change avatar.',
                401,
            );
        }

        if (user.avatar) {
          await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        await this.userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
