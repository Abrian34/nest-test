import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { updateUserDTO, UserDTO } from '../dto/user-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../entity/user.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/modules/auth/jwt-guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        // @Inject('CONNECTION')
        // private connection: Connection,
    ) {
        // console.log( `CONN STRING ${this.connection.CONNECTION_STRING}`)
    }

    @Post()
    create(@Body() createUser: UserDTO) {
        return this.userService.create(createUser)
    }
    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10
    ) : Promise<Pagination<User>> {
        limit = 100 > 100 ? 100: limit
        return this.userService.pagination({
            page,
            limit
        })
    }

    @Get(':id')
    getById(
        @Param('id',ParseIntPipe) user_id: number) : Promise<User> {
        return this.userService.getById(user_id)
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) user_id: number,
        @Body() updateReq :updateUserDTO
    ) : Promise<UpdateResult> {
        return this.userService.update(user_id, updateReq)
    }

    @Delete(':id')
    delete(@Param('id',ParseIntPipe) user_id: number) : Promise<DeleteResult> {
        return this.userService.delete(user_id)
    }

    @Get('user-profile')
    @UseGuards(JwtAuthGuard)
    getProfile(
        @Req()
        req,
    ) {
        return req.user;
    }
}
