// address.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Buyer } from './buyer.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  // @OneToOne(() => Buyer, buyer => buyer.address)
  // buyer: Buyer;
}
