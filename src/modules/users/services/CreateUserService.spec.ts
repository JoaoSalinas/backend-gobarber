import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
    it('should be able to create a new User', async () => {

        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
        const User = await createUser.execute({
          name: 'Jhon Doe',
          email: 'jhondoe@exemple.com',
          password: '123456'
        });

        expect(User).toHaveProperty('id');
    });

    it('should not be able to create a new User With same email from another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
        const user = await createUser.execute({
          name: 'Jhon Doe',
          email: 'jhondoe@exemple.com',
          password: '123456'
        });

        expect(
            createUser.execute({
                name: 'Jhon Doe',
                email: 'jhondoe@exemple.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);

    });
});
