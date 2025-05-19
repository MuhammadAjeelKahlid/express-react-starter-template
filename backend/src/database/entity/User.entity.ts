import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
} from "typeorm";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    profileIcon!: string;

    @Column()
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({ type: "date", nullable: true })
    dob!: Date;

    @Column({ nullable: true })
    city!: string;

    @Column({ nullable: true })
    state!: string;

    @Column({ nullable: true })
    country!: string;

    // 🔹 Email verification
    @Column({ default: false })
    emailVerified!: boolean;

    @Column({ type: "varchar", nullable: true, unique: true })
    verificationToken!: string | null;


    @Column({ type: "timestamp", nullable: true })
    verificationTokenExpires!: Date | null;

    // 🔹 New additions
    @Column({ nullable: true })
    ipAddress!: string;

    @Column({ type: "timestamp", nullable: true })
    lastLogin!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
