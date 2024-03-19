import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminRegEntity } from "./admin.entity";

@Entity("Additional_Info")
export class AdditionalInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, nullable: true })
  nid_no: string;

  @Column({ length: 30, nullable: true })
  passport_no: string;

  @OneToOne(() => AdminRegEntity, admin => admin.additionalInfo,{onDelete: "CASCADE",onUpdate:"CASCADE"})
  @JoinColumn({name:"admin_id"})
  admin: AdminRegEntity;

}