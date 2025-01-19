import { Exclude } from "class-transformer";
import { Song } from "src/modules/songs/entity/songs.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('increment')
    user_id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    @Exclude()
    password: string

    // @Column({ nullable: true, type: 'text' })
    // twoFASecret: string;

    // @Column({ default: false, type: 'boolean' })
    // enable2FA: boolean;

    @Column()
    apiKey: string;

    @OneToMany(() => Song, (songs) => songs.users)
    songs: Song[];
}