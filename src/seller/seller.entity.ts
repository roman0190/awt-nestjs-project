import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { GigEntity } from './gigs/gig.entity';
import { SellerCredsEntity } from './sellerCreds.entity';

@Entity('seller')
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @CreateDateColumn({ type: 'date' })
  joinDate?: string;

  @Column({ type: 'varchar', default: '' })
  pfp?: string;

  @OneToOne(
    () => SellerCredsEntity,
    (sellerCreds: SellerCredsEntity) => sellerCreds.seller,
    { cascade: true },
  )
  sellerCreds: SellerCredsEntity;

  @OneToMany(() => GigEntity, (gig: GigEntity) => gig.gigOwner, {
    cascade: true,
  })
  gigs: GigEntity[];
}
