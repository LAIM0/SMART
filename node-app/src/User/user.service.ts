import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: UserInterface): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }


  async getUser(email: string) {
    const username = email.toLowerCase();
    const user = await this.userModel.findOne({ email });
    return user;
  }
    async create(userName: string, password :string, lastName:string, firstName :string, isAdmin :boolean): Promise<User> {
        const existingUser = await this.userModel.findOne({ name: userName });
        if (existingUser) {
            return existingUser;
        }
        const newUser = new this.userModel({ email: userName, passwordHash:password, lastName:lastName, firstName:firstName, isAdmin:isAdmin });
        return newUser.save();
    }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Ajoutez d'autres méthodes selon les besoins, par exemple pour chercher, mettre à jour ou supprimer des utilisateurs
}
