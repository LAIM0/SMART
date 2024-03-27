import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as session from "express-session"
import * as passport from "passport"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Active CORS
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
}
bootstrap();
