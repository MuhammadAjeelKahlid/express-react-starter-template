import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, } from "typeorm";

@Entity()
export class DeniedToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    token!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
