import { Injectable } from '@nestjs/common';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import type { FoundPet as FoundPetDTO } from 'src/core/interfaces/found-pet.interface';
import { EmailOptions } from 'src/core/interfaces/mail-options.interface';
import { EmailService } from 'src/email/email.service';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';
import { envs } from 'src/config/envs';
import { generateMapboxImage } from 'src/core/utils/utils';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource
  ) {}

  private getCoordinates(pet: FoundPet | LostPet) {
    return {
      lon: pet.location.coordinates[0],
      lat: pet.location.coordinates[1],
    };
  }

  async createFoundPet(data: FoundPetDTO): Promise<FoundPet> {
    const newFoundPet = this.foundPetRepository.create({
      species: data.species,
      breed: data.breed,
      color: data.color,
      size: data.size,
      description: data.description,
      photo_url: data.photo_url,
      finder_name: data.finder_name,
      finder_email: data.finder_email,
      finder_phone: data.finder_phone,
      location: data.location,
      address: data.address,
      found_date: data.found_date,
    });

    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);
    const { lon, lat } = this.getCoordinates(savedFoundPet);

    const lostPetsNearby = await this.dataSource
      .getRepository(LostPet)
      .createQueryBuilder('lost')
      .addSelect(
        `ST_Distance(
          lost.location,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )`,
        'distance'
      )
      .where('lost.is_active = true')
      .andWhere(
        `ST_DWithin(
          lost.location,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          500
        )`
      )
      .setParameters({ lng: lon, lat })
      .orderBy('distance', 'ASC')
      .getMany();

    // Enviar emails a dueños de mascotas perdidas cercanas
    for (const lostPet of lostPetsNearby) {
      const lostCoords = this.getCoordinates(lostPet);
      const foundCoords = this.getCoordinates(savedFoundPet);

      const mapUrl = generateMapboxImage(
        lostCoords.lon,
        lostCoords.lat,
        foundCoords.lon,
        foundCoords.lat
      );

      const template = generateFoundPetEmailTemplate(
        lostPet,
        savedFoundPet,
      );

      const options: EmailOptions = {
        to: lostPet.owner_email,
        subject: `Mascota encontrada cerca de ${lostPet.name}`,
        html: template,
      };

      await this.emailService.sendEmail(options);
    }

    return savedFoundPet;
  }
}