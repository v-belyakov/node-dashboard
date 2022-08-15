import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
  create: jest.fn(),
  find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
  usersService = container.get<IUserService>(TYPES.UserService);
});

let createUser: UserModel | null;

describe('User Service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValue('1');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      }),
    );

    createUser = await usersService.createUser({
      email: 'a@a.a',
      name: 'aa',
      password: '1',
    });

    expect(createUser?.id).toEqual(1);
    expect(createUser?.password).not.toEqual('1');
  });

  it('validateUser: success', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
    const res = await usersService.validateUser({
      email: 'a@u1.aa',
      password: '1',
    });
    expect(res).toBeTruthy();
  });

  it('validateUser: wrong password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createUser);
    const res = await usersService.validateUser({
      email: 'a@u1.aa',
      password: '2',
    });
    expect(res).toBeFalsy();
  });
});
