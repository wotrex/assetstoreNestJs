import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>
  ) {}
  
  async getByEmail(email: string) {
    return (await this.usersRepository.findOne({ email }));
    /* const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND); */
  }
  async getByUsername(username: string) {
    return (await this.usersRepository.findOne({ username }));
    /* const user = await this.usersRepository.findOne({ username });
    if (user) {
      return user;
    }
    throw new HttpException('User with this name does not exist', HttpStatus.NOT_FOUND); */
  }
 
  /* async create(userData: RegisterDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  } */
  async update(userData: Partial<User>, username: string) {
    let oldUser: User = await this.getByUsername(username);    
    oldUser.id = null;
    if (oldUser){
      if(userData.username){
        let user: User = await this.getByUsername(userData.username);
        if (!user) {
          oldUser.username = userData.username;
      }
      }
      if(userData.password){
          oldUser.password = await this.getHash(userData.password);;
      }
      if(userData.email){
        let user: User = await this.getByEmail(userData.email);
        if (!user) {
            oldUser.email = userData.email;
        }
      }
      if(userData.cart){
          oldUser.cart = userData.cart;
      }
      if(userData.items){
        oldUser.items = userData.items;
      }
      await this.usersRepository.update((await this.getByUsername(username)).id, oldUser);
    }
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
  async createUser(user: User){
    user.password = await this.getHash(user.password);
    let cart: string[] = [];
    user.cart = cart;
    user.items = cart;
    return this.usersRepository.save(user);
  }

  async getHash(password: string|undefined) {
      return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined) {
    return bcrypt.compare(password, hash);
  }
}
