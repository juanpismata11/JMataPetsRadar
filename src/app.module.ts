import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { LostPetsModule } from './lost_pet/lost_pet.module';
import { EmailModule } from './email/email.module';
import { FoundPetController } from './found_pet/found_pet.controller';
import { FoundPetsService } from './found_pet/found_pet.service';
import { AppService } from './app.service';
import { envs } from './config/envs';
import { LostPet } from './core/db/entities/lost-pet.entity';
import { FoundPet } from './core/db/entities/found-pet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      entities: [LostPet, FoundPet],
      synchronize: false,
    }),
    LostPetsModule,
    EmailModule,
  ],
  controllers: [AppController, FoundPetController],
  providers: [AppService, FoundPetsService],
})
export class AppModule {}
