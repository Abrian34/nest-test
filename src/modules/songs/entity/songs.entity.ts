import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song{
    @PrimaryGeneratedColumn('increment')
    song_id: number

    @Column()
    song_title: string

    @Column()
    song_lyrics: string

    @ManyToOne(() => User, (users) => users.songs)
    @JoinColumn({ name: 'user_id' })
    users: User;

    @Column()
    user_id: number
    
}