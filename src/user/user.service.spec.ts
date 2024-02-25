import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should retrive all users', () => {
    const createUserDto: CreateUserDto = {
      name: 'User for Testing',
      email: 'user@test.com',
      role: 'user',
    };
    const createUserDto2: CreateUserDto = {
      name: 'User2 for Testing',
      email: 'user2@test.com',
      role: 'user',
    };

    const createdUser = userService.create(createUserDto);
    const createdUser2 = userService.create(createUserDto2);
    const users = userService.findAll();
    expect(users).toEqual([createdUser, createdUser2]);
  });

  it('should create a new user', () => {
    const createUserDto: CreateUserDto = {
      name: 'User for Testing',
      email: 'user@test.com',
      role: 'user',
    };
    const createdUser = userService.create(createUserDto);
    expect(createdUser.name).toEqual(createUserDto.name);
    expect(createdUser.email).toEqual(createUserDto.email);
    expect(createdUser.role).toEqual(createUserDto.role);
    expect(createdUser.id).toBeDefined();
  });

  it('should throw a validation error for invalid data', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Email Test',
      email: 'invalid-email', // Invalid email format
      role: 'user',
    };

    try {
      const createdUser = await userService.create(createUserDto);
      fail('Expected validation error, but none was thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('email must be an email address');
    }
  });

  it('should get a user by ID', () => {
    const createUserDto: CreateUserDto = {
      name: 'User for Testing',
      email: 'user@test.com',
      role: 'user',
    };
    const createdUser = userService.create(createUserDto);
    const user = userService.findOne(1);
    expect(user).toBeDefined();
    expect(user.id).toEqual(createdUser.id);
  });

  it('should update a user', () => {
    const createUserDto: CreateUserDto = {
      name: 'User for Testing',
      email: 'user@test.com',
      role: 'user',
    };
    userService.create(createUserDto);
    
    const updateUserDto: UpdateUserDto = {
      name: 'Updated',
      email: 'Updated@email.com',
      role: 'admin',
    };
    const updatedUser = userService.update(1, updateUserDto);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toEqual(updateUserDto.name);
    expect(updatedUser.email).toEqual(updateUserDto.email);
    expect(updatedUser.role).toEqual(updateUserDto.role);
  });

  it('should delete a user', () => {
    const createUserDto: CreateUserDto = {
      name: 'User for Testing',
      email: 'user@test.com',
      role: 'user',
    };
    userService.create(createUserDto);
    
    const removedId = 1;
    const deletedUser = userService.remove(removedId);
    const findDeleted = () => userService.findOne(removedId);

    expect(deletedUser).toBeDefined();
    expect(deletedUser.id).toEqual(removedId);
    expect(findDeleted).toThrow(NotFoundException)
  });
});
