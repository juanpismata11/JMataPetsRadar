import { Body, Controller, Post } from '@nestjs/common';
import type { FoundPet as FoundPetDTO } from 'src/core/interfaces/found-pet.interface';
import { FoundPetsService } from './found_pet.service';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() data: FoundPetDTO) {
    return this.foundPetsService.createFoundPet(data);
  }
}