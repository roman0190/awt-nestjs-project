import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SellerEntity } from '../seller.entity';

@Entity('gig')
export class GigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int4' })
  price: number;

  @CreateDateColumn({ type: 'date' })
  datePosted: string;

  @Column({ type: 'varchar', default: '' })
  gigImage: string;

  @Column({ type: 'varchar', default: '' })
  gigThumbnail: string;

  @ManyToOne(() => SellerEntity, (seller: SellerEntity) => seller.gigs, {
    eager: true,
  })
  @JoinColumn({ name: 'ownerId' })
  gigOwner: SellerEntity;
}
