import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminRegEntity } from './admin.entity';

@Entity()
export class AnnouncementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // You can include additional fields as needed

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => AdminRegEntity, admin => admin.announcements,{onDelete:"CASCADE"})
  admin: AdminRegEntity;
}