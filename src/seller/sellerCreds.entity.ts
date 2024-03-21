import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { SellerEntity } from './seller.entity';

@Entity('sellerCreds')
export class SellerCredsEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  salt: string;

  @OneToOne(() => SellerEntity)
  @JoinColumn()
  seller: SellerEntity;
}
