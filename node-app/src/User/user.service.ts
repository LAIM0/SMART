import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async createUser(user: UserInterface): Promise<User> {
  //   const newUser = new this.userModel(user);
  //   return newUser.save();
  // }

  async createUser(email:string, password:string, lastName:string, firstName:string, isAdmin:boolean, teamId:string): Promise<User> {
    console.log("createUser");
    const newUser = new this.userModel({ email: email, passwordHash:password, lastName:lastName, firstName:firstName, isAdmin:isAdmin, teamId:teamId }); 
    return newUser.save();
  }

  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne({ email }, { passwordHash: hashedPassword });
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
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  } 

  // Ajoutez d'autres méthodes selon les besoins, par exemple pour chercher, mettre à jour ou supprimer des utilisateurs
}
