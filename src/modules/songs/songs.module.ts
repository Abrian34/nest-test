import { Module } from '@nestjs/common';
import { SongsService } from './service/songs.service';
import { error } from 'console';
import { connection } from 'src/common/constants/connection';
import { SongsController } from './controller/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/songs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongsController],
  providers: [SongsService]
})
export class SongsModule {

    private readonly songs = []

    create(songs) {
        this.songs.push(songs);
        return this.songs
    }

    findAll() {
        // throw new error('Error in DB')
        return this.songs
    }
}
