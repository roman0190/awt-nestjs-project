import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GigEntity } from '../gigs/gig.entity';
import { SellerEntity } from '../seller.entity';

@Entity('portfolio')
export class PortfolioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', array: true })
  relevantSkills: string[];

  @Column({ type: 'int4' })
  rating: number;

  @Column({ type: 'varchar' })
  reviewMessage: string;

  @Column({ type: 'int4' })
  sellerId: string;

  @ManyToOne(() => GigEntity, (gig: GigEntity) => gig.portfolios, {
    eager: true,
    onDelete: 'CASCADE',
  })
  gig: GigEntity;
}
