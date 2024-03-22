import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';


const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHostname}:${mongoPort}/${mongoDb}`, {
      authSource: "admin", // Souvent nécessaire si vous avez spécifié un utilisateur admin pour MongoDB
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
/*@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://mongoEcoexya:83pb9wM9F5fKxV@mongo:27017/dbEcoexya`, {
      authSource: "admin", // Souvent nécessaire si vous avez spécifié un utilisateur admin pour MongoDB
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})*/
export class AppModule {}
