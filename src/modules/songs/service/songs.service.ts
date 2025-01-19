import { Injectable, Scope } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from '../entity/songs.entity';
import { SongDTO } from '../dto/create-song-dts';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable({
    scope: Scope.TRANSIENT
})
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) {}

    async pagination(options: IPaginationOptions) : Promise<Pagination<Song>> {
        return paginate<Song>(this.songsRepository, options)
    }

    create(songDTO: SongDTO) : Promise<Song> {
        // get user entity for id?

        // this.songs.push(songs);
        // return this.songs
        const song = new Song()
        // song.song_id = songDTO.song_id
        song.user_id = songDTO.user_id
        song.song_title = songDTO.song_title
        song.song_lyrics = songDTO.song_lyrics
        return this.songsRepository.save(song)
    }

    update(song_id: number, updateReq: SongDTO) : Promise<UpdateResult> {
        return this.songsRepository.update(song_id, updateReq)
    }

    findAll() {
        return this.songsRepository.find()
    }

    findOne(song_id: number) : Promise<Song> {
        return this.songsRepository.findOneBy({song_id})
    }

    delete(song_id: number) : Promise<DeleteResult> {
        return this.songsRepository.delete(song_id)
    }
}
