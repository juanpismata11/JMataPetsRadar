import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { EmailModule } from 'src/email/email.module';
import { dataSourceOptions } from 'src/core/db/data-source';
import { FoundPetsController } from './found_pet/found_pet.controller';
import { FoundPetsService } from './found_pet/found_pet.service';
import { LostPetsController } from './lost_pet/lost_pet.controller';
import { LostPetsService } from './lost_pet/lost_pet.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([FoundPet, LostPet]),
    EmailModule,
    CacheModule,
  ],
  controllers: [FoundPetsController, LostPetsController],
  providers: [FoundPetsService, LostPetsService],
})
export class AppModule {}