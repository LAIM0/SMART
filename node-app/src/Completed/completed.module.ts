import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompletedService } from './completed.service';
import { CompletedController } from './completed.controller';
import { CompletedSchema } from './completed.schema';
import { UserSchema } from 'src/User/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Completed', schema: CompletedSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [CompletedController],
  providers: [CompletedService],
})
export class CompletedModule {}
