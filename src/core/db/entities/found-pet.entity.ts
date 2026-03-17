import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Point } from 'typeorm';

@Entity('found_pets')
export class FoundPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  species: string;

  @Column({ type: 'varchar', nullable: true })
  breed: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  size: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  photo_url: string;

  @Column({ type: 'varchar' })
  finder_name: string;

  @Column({ type: 'varchar' })
  finder_email: string;

  @Column({ type: 'varchar' })
  finder_phone: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location: Point;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'timestamp' })
  found_date: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}