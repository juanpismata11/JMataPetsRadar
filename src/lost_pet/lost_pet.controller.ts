import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { LostPetsService } from './lost_pet.service';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';


@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() data: Partial<LostPet>) {
    return this.lostPetsService.createLostPet(data);
  }

  @Get()
  async findAll() {
    return this.lostPetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.lostPetsService.findOne(id);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: number) {
    await this.lostPetsService.deactivate(id);
    return { message: 'Mascota marcada como no activa' };
  }
}