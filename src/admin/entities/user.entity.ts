
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminRegEntity } from "./admin.entity";
@Entity("UserInfo")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 11 })
  number: string;

  @Column({ type: 'varchar', length: 20 })
  role: string;

  @ManyToOne(() => AdminRegEntity, admin => admin.users)
  admin: AdminRegEntity;


}