import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Connection } from 'src/common/constants/connection';
import { SongsService } from '../service/songs.service';
import { SongDTO } from '../dto/create-song-dts';
import { Song } from '../entity/songs.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SongJwtGuard } from '../../auth/song-jwt-guards';

@Controller('songs')
export class SongsController {
    constructor(
        private songsService: SongsService,
        // @Inject('CONNECTION')
        // private connection: Connection,
    ) {
        // console.log( `CONN STRING ${this.connection.CONNECTION_STRING}`)
    }

    @Post()
    create(
        @Body() createSong: SongDTO
    ): Promise<Song> {
        return this.songsService.create(createSong)
    }
    @Get()
    @UseGuards(SongJwtGuard)
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10
    ) : Promise<Pagination<Song>> {
        limit = 100 > 100 ? 100: limit
        return this.songsService.pagination({
            page,
            limit
        })
    }

    @Get(':id')
    @UseGuards(SongJwtGuard)
    findOne(
        @Param('id',ParseIntPipe) song_id: number) : Promise<Song> {
        return this.songsService.findOne(song_id)
    }

    @Put(':id')
    @UseGuards(SongJwtGuard)
    update(
        @Param('id', ParseIntPipe) song_id: number,
        @Body() updateReq : SongDTO
    ) : Promise<UpdateResult> {
        return this.songsService.update(song_id, updateReq)
    }

    @Delete(':id')
    @UseGuards(SongJwtGuard)
    delete(@Param('id',ParseIntPipe) song_id: number) : Promise<DeleteResult> {
        return this.songsService.delete(song_id)
    }
}
