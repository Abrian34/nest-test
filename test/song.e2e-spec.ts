import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { SongsModule } from "../src/modules/songs/songs.module";
import { UserService } from "../src/modules/user/service/user.service";
import { SongsService } from "../src/modules/songs/service/songs.service";
import { Song } from "../src/modules/songs/entity/songs.entity";
import { SongDTO } from "../src/modules/songs/dto/create-song-dts";
import { User } from "../src/modules/user/entity/user.entity";
import { JwtStrategy } from "../src/modules/auth/jwt-strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { authConstants } from "../src/modules/auth/auth.constants";
import { MockAuthGuard } from "./mock-user-repository";

describe('Song - /songs', () => {
  let app: INestApplication;
  let userService: UserService;
  let songsService: SongsService;
  let moduleFixture: TestingModule;
//   let UserRepository = Repository<User>


  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://postgres:1234@localhost:5432/TestDB',
          synchronize: true,
          entities: [Song, User],
          dropSchema: true,
        }),
        SongsModule,
        TypeOrmModule.forFeature([User, Song]),
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: authConstants.secret,
            signOptions: { expiresIn: '1h' }
        })
      ],
      providers: [UserService, SongsService, JwtStrategy,
        {
            provide: getRepositoryToken(User),
            useClass: MockAuthGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    console.log(app, "sseerdee")
    await app.init();

    userService = await moduleFixture.resolve<UserService>(UserService);
    songsService = await moduleFixture.resolve<SongsService>(SongsService);
  });

  afterEach(async () => {
    const songRepository = app.get('SongRepository');
    await songRepository.clear();
  });

  afterAll(async () => {
    if (app) {
      console.log('Closing app...');
      await app.close();
    } else {
      console.error('App is not initialized!');
      console.log('...', app);

    }
  });

  // Helper function to create a User
  const createUser = async (username: string, email: string, password: string): Promise<User> => {
    const userDTO = { username, email, password };
    return userService.create(userDTO); // Use UserService to create the user
  };

  // Helper function to create a Song
  const createSong = async (songDTO: SongDTO): Promise<Song> => {
    return songsService.create(songDTO); // Use SongsService to create the song
  };

  it('/GET songs/:id', async () => {
    // Create a User first
    const user = await createUser('testuser', 'test@example.com', 'password123');

    // Create a Song for that User
    const songDTO: SongDTO = {
      song_title: 'Animals',
      song_lyrics: 'Some lyrics here',
      user_id: user.user_id,
    };
    const newSong = await createSong(songDTO);

    // Retrieve the song
    const results = await request(app.getHttpServer()).get(`/songs/${newSong.song_id}`);

    expect(results.statusCode).toBe(200);
    expect(results.body).toHaveProperty('song_id', newSong.song_id);
    expect(results.body.song_title).toBe(newSong.song_title);
    expect(results.body.song_lyrics).toBe(newSong.song_lyrics);
  });
});