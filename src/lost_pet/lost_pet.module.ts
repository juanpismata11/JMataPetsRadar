import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPetsController } from './lost_pet.controller';
import { LostPetsService } from './lost_pet.service';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostPet])],
  controllers: [LostPetsController],
  providers: [LostPetsService],
})
export class LostPetsModule {}