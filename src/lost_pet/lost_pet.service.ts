import { Injectable } from '@nestjs/common';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import type { LostPet as LostPetDTO } from 'src/core/interfaces/lost-pet.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';

//npm i applicationinsights

const CACHE_KEY_ALL_PETS = "pets:all"

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly cacheService: CacheService
  ) {}

      private readonly redis = new Redis({
        host: envs.REDIS_HOST,
        port: envs.REDIS_PORT
    })

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

    const saved =  this.lostPetRepository.save(newLostPet)
    await this.redis.del(CACHE_KEY_ALL_PETS)

    return saved
  }

  async getActiveLostPets(): Promise<LostPet[]>{
    try{
      console.log("[IncidentService] intentando traer las mascotas perdidas que siguen activas desde cache")

      const cached = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_PETS);
      if(cached){
        console.log("Cache history, retornando")
        return cached
      }


      const data = await this.lostPetRepository
      .createQueryBuilder('pets')
      .where( `pets.is_active === :isActive`, {isActive: true} )
      .orderBy('pets.lost_date', 'DESC') // más recientes primero
      .getMany();

      await this.cacheService.set(CACHE_KEY_ALL_PETS, data)

    return data;

} catch(error){
    console.error("[IncidentService] error al traer incidentes:", error);

    return [];

}
  }
}