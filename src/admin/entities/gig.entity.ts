import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminRegEntity } from './admin.entity';


@Entity("pending-gigs")
export class GigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

//   @ManyToOne(() => AdminRegEntity, admin => admin.gigs)
//   admin: AdminRegEntity;
}