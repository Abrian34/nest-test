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
  providers: [SongsService],
  exports: [SongsService]
})
export class SongsModule {}
