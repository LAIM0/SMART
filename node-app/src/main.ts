import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as session from "express-session";
import * as passport from "passport";
import 'moment/locale/fr'; 
import * as moment from 'moment'; 
import { CategoryService } from './Category/category.service';


async function bootstrap() {
  // Initialise Moment.js avec la locale et les options nécessaires
  moment.locale('fr'); 

  const app = await NestFactory.create(AppModule);
  // const userService = app.get<UserService>(UserService);
  // await userService.createDefaultAdminIfNotExists();
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.use(
    session({
      secret: "keyboard",
      resave: false,
      saveUninitialized: false,
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3001);

  // Exécution des seeds pour les données par défaut
  app.get(CategoryService).seedCategories();


}
bootstrap();
