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
      found_date: data.found_date
    });

    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);

    const lng = data.location.coordinates[0];
    const lat = data.location.coordinates[1];

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
      .setParameters({ lng, lat })
      .orderBy('distance', 'ASC')
      .getMany();

      for (const lostPet of lostPetsNearby) {
        const template = generateFoundPetEmailTemplate(
          lostPet,
          savedFoundPet as FoundPet
        );

        const options: EmailOptions = {
          to: lostPet.owner_email,
          subject: `Mascota encontrada cerca de ${lostPet.name}`,
          html: template
        };

        await this.emailService.sendEmail(options);
      }

    return savedFoundPet;
  }
}