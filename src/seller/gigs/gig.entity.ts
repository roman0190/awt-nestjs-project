import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PortfolioEntity } from '../portfolio/portfolio.entity';
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
    onDelete: 'CASCADE',
  })
  gigOwner: SellerEntity;

  @OneToMany(
    () => PortfolioEntity,
    (portfolio: PortfolioEntity) => portfolio.gig,
    {
      cascade: true,
    },
  )
  portfolios: PortfolioEntity[];
}
