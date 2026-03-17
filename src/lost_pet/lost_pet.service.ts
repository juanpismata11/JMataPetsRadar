import { Injectable } from '@nestjs/common';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import type { LostPet as LostPetDTO } from 'src/core/interfaces/lost-pet.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>
  ) {}

  async createLostPet(data: LostPetDTO): Promise<LostPet> {
    const newLostPet = this.lostPetRepository.create({
      name: data.name,
      species: data.species,
      breed: data.breed,
      color: data.color,
      size: data.size,
      description: data.description,
      photo_url: data.photo_url,
      owner_name: data.owner_name,
      owner_email: data.owner_email,
      owner_phone: data.owner_phone,
      location: data.location,
      address: data.address,
      lost_date: data.lost_date,
      is_active: true
    });

    return this.lostPetRepository.save(newLostPet);
  }
}