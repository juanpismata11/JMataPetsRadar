import { Injectable } from '@nestjs/common';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import type { LostPet as LostPetDTO } from 'src/core/interfaces/lost-pet.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { logger } from 'src/config/logger';

const CACHE_KEY_LOST_PETS = 'lost_pets:all';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly cacheService: CacheService,
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
      is_active: true,
    });

    const saved = await this.lostPetRepository.save(newLostPet);
    await this.cacheService.delete(CACHE_KEY_LOST_PETS);

    return saved;
  }

  async getActiveLostPets(): Promise<LostPet[]> {
    try {
      const cached = await this.cacheService.get<LostPet[]>(CACHE_KEY_LOST_PETS);
      if (cached) {
        logger.info('[LostPetsService] cache hit');
        return cached;
      }

      const data = await this.lostPetRepository
        .createQueryBuilder('pets')
        .where('pets.is_active = :isActive', { isActive: true })
        .orderBy('pets.lost_date', 'DESC')
        .getMany();

      await this.cacheService.set(CACHE_KEY_LOST_PETS, data);
      return data;
    } catch (error) {
      logger.error('[LostPetsService] error al traer mascotas perdidas:', error);
      return [];
    }
  }
}