import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { generateMapboxImage } from 'src/core/utils/utils';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';

@Injectable()
export class FoundPetsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: EmailService
  ) {}

  async registerFoundPet(foundPetData: Partial<FoundPet>) {
    // 1️⃣ Guardar la mascota encontrada
    const foundPetRepo = this.dataSource.getRepository(FoundPet);
    const foundPet = foundPetRepo.create(foundPetData);
    await foundPetRepo.save(foundPet);

    if (!foundPet.location) {
      throw new Error('La ubicación de la mascota encontrada es obligatoria');
    }

    const [foundLon, foundLat] = foundPet.location.coordinates; // GeoJSON [lng, lat]

    // 2️⃣ Buscar mascotas perdidas en radio de 500m
    const lostPetsRepo = this.dataSource.getRepository(LostPet);
    const lostPetsNearby = await lostPetsRepo
      .createQueryBuilder('lost_pet')
      .where('lost_pet.is_active = true')
      .andWhere(
        `ST_DWithin(
           lost_pet.location,
           ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
           500
         )`,
        { lng: foundLon, lat: foundLat }
      )
      .orderBy(
        `ST_Distance(
           lost_pet.location,
           ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
         )`,
        'ASC'
      )
      .getMany();

    // 3️⃣ Enviar correo a cada dueño
    for (const lostPet of lostPetsNearby) {
      if (!lostPet.location) continue;
      const [lostLon, lostLat] = lostPet.location.coordinates;
      const mapUrl = generateMapboxImage(lostLat, lostLon, foundLat, foundLon);
      const html = generateFoundPetEmailTemplate(lostPet, foundPet, mapUrl);

      await this.mailService.sendEmail({
        to: lostPet.owner_email,
        subject: `¡Mascota encontrada! ${lostPet.name}`,
        html
      });
    }

    return { foundPet, notifiedOwners: lostPetsNearby.length };
  }
}