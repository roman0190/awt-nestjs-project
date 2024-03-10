import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("AdminRegistration")
export class AdminRegEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;
  
    @Column({ type: 'timestamp' }) // Assuming your database supports TIMESTAMP type
    date: Date;
  
    @Column({ type: 'varchar', length: 11 })
    number: string;
  }