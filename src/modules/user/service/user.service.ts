import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { User } from '../entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { LoginDTO, updateUserDTO, UserDTO } from '../dto/user-dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async pagination(options: IPaginationOptions) : Promise<Pagination<User>> {
        return paginate<User>(this.usersRepository, options)
    }

    async create(userDTO: UserDTO) : Promise<User> {
        const user = new User()
        user.username = userDTO.username
        user.email = userDTO.email
        // user.password = userDTO.password
        user.apiKey = uuid4()

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt)
        const savedUser = await this.usersRepository.save(user)
        delete savedUser.password
        return savedUser
    }

    async update(user_id: number, updateReq: updateUserDTO) : Promise<UpdateResult> {
        return this.usersRepository.update(user_id, updateReq)
    }

    async findAll() {
        return this.usersRepository.find()
    }

    async getById(user_id: number) : Promise<User> {
        return this.usersRepository.findOneBy({user_id})
    }

    async findLogin(data: LoginDTO) : Promise<User> {
        const user = this.usersRepository.findOneBy({username: data.username})
        if (!user) {
            throw new UnauthorizedException('Could Not Find User')
        }

        return user
    }

    // async updateSecretKey(user_id, secret: string): Promise<UpdateResult> {
    //     return this.usersRepository.update(
    //       { user_id: user_id },
    //       {
    //         twoFASecret: secret,
    //         enable2FA: true,
    //       },
    //     );
    //   }

    // async disable2FA(user_id: number): Promise<UpdateResult> {
    //     return this.usersRepository.update(
    //       { user_id: user_id },
    //       {
    //         enable2FA: false,
    //         twoFASecret: null,
    //       },
    //     );
    //   }

    async getByApiKey(apiKey: string): Promise<User> {
        return this.usersRepository.findOneBy({ apiKey });
    }

    async delete(user_id: number) : Promise<DeleteResult> {
        return this.usersRepository.delete(user_id)
    }
}
