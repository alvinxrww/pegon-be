import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users = []

  create(createUserDto: CreateUserDto) {
    let newId = 1;

    if (this.users.length != 0) {
      const usersSortedByIdDesc = [...this.users].sort((a, b) => b.id - a.id)
      newId = usersSortedByIdDesc[0].id + 1
    }

    const newUser = {
      id: newId,
      ...createUserDto
    }
    this.users.push(newUser)

    return newUser;
  }

  findAll(role?) {
    if (role) return this.users.filter(user => user.role === role)
    return this.users
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id)
    if (!user) throw new NotFoundException("User Not Found")
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map(user => {
      if (user.id === id) {
        return { ...user, ...updateUserDto }
      }
      return user
    })

    return this.findOne(id);
  }

  remove(id: number) {
    const removedUser = this.findOne(id)
    this.users = this.users.filter(user => user.id != id)
    return removedUser;
  }
}
