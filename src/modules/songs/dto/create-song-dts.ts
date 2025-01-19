import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SongDTO {

    @IsNumber()
    @IsNotEmpty()
    user_id?: number;

    @IsString()
    @IsNotEmpty()
    song_title: string;

    @IsString()
    @IsNotEmpty()
    song_lyrics: string;
}