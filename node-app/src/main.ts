import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as session from 'express-session';
import * as passport from 'passport';
import 'moment/locale/fr';
import * as moment from 'moment';
import { CategoryService } from './Category/category.service';
import { TeamService } from './Team/team.service';
import { SettingsService } from './Settings/settings.service';
import { SchedulerService } from './Scheduler/scheduler.service';
import { UserService } from './User/user.service';


async function bootstrap() {
  // Initialise Moment.js avec la locale et les options nécessaires
  moment.locale('fr');

  const app = await NestFactory.create(AppModule);

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Ecoexya API')
    .setDescription('Swagger of Ecoexya web app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3001);

  // Exécution des seeds pour les données par défaut
  await app.get(CategoryService).seedCategories();
  await app.get(TeamService).seedTeam();
  await app.get(SettingsService).seedSettings();
  await app.get(UserService).createDefaultAdminIfNotExists();

  //Lancement du CRON pour les défis périodiques
  await app.get(SchedulerService).scheduleDailyUpdates();
  await app.get(SchedulerService).scheduleWeeklyUpdates();
  await app.get(SchedulerService).scheduleMonthlyUpdates();
}
bootstrap();
