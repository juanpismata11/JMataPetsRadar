import { Controller, Post, Body } from '@nestjs/common';
import type { LostPet } from 'src/core/interfaces/lost-pet.interface';
import { LostPetsService } from './lost_pet.service';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() data: LostPet) {
    return this.lostPetsService.createLostPet(data);
  }
}