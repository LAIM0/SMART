import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, passwordHash: string): Promise<User> {
    const newUser = new this.userModel({
      email,
      passwordHash
    });
    return newUser.save();
  }

  async getUser(email: string) {
    const username = email.toLowerCase();
    const user = await this.userModel.findOne({ email });
    return user;
  }
    // async create(userName: string): Promise<User> {
    //     const existingUser = await this.userModel.findOne({ name: userName });
    //     if (existingUser) {
    //         return existingUser;
    //     }
    //     const newUser = new this.userModel({ name: userName });
    //     return newUser.save();
    // }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Ajoutez d'autres méthodes selon les besoins, par exemple pour chercher, mettre à jour ou supprimer des utilisateurs
}
