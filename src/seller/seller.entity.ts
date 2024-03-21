import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
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
}
