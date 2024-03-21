
//buyer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert , OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Address } from './address.entity';

@Entity()
export class Buyer {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  // @Column()
  // profilePicture: string;

  @Column()
  filename: string;


  @OneToMany(() => Order, (order:Order) => order.buyer, {cascade:true})
  orders: Order[];

  // @OneToOne(() => Address, address => address.buyer, { cascade: true })
  // @JoinColumn()
  // address: Address;

}


// // buyer.entity.ts
// import { Entity,PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Order } from './order.entity';
// import { Address } from './address.entity';

// @Entity()
// export class Buyer {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @OneToMany(() => Order, order => order.buyer)
//   orders: Order[];

//   @OneToMany(() => Address, address => address.buyer)
//   addresses: Address[];
// }



