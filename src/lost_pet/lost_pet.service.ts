import { Injectable } from '@nestjs/common';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class LostPetsService {
  constructor(private readonly dataSource: DataSource) {}

  async createLostPet(data: Partial<LostPet>): Promise<LostPet> {
    const repo = this.dataSource.getRepository(LostPet);
    const lostPet = repo.create(data);
    return await repo.save(lostPet);
  }

  async findAll(): Promise<LostPet[]> {
    const repo = this.dataSource.getRepository(LostPet);
    return await repo.find({ where: { is_active: true } });
  }

  async findOne(id: number): Promise<LostPet | null> {
    const repo = this.dataSource.getRepository(LostPet);
    return await repo.findOne({ where: { id } });
  }

  async deactivate(id: number): Promise<void> {
    const repo = this.dataSource.getRepository(LostPet);
    await repo.update(id, { is_active: false });
  }
}