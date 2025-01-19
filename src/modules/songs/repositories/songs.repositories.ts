import { Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { QueryBuilder } from "src/database/query-builder";
import * as dayjs from "dayjs";
import { SongDTO } from "../dto/create-song-dts";

const SEARCH_COLUMNS = ["username", "email"];

@Injectable()
export class SongsRepositories {
  constructor(private queryBuilder: QueryBuilder) {}

  async findAll(
    page: number,
    limit: number,
    order: string,
    sort: "ASC" | "DESC",
    search: string,
  ) {
    const songs = await this.queryBuilder
      .select("*")
      .from("user")
      .where({})
      .search(SEARCH_COLUMNS, search)
      .orderBy(order, sort)
      .limit(limit)
      .offset(page)
      .execute(QueryTypes.SELECT);

    return songs;
  }

  async findOne(where: Record<string, any>) {
    const user = await this.queryBuilder
      .select("*")
      .from("user")
      .where(where)
      .limit(1)
      .offset(0)
      .execute(QueryTypes.SELECT);
    return user[0];
  }

  async create(data: SongDTO, name: string) {
    await this.queryBuilder
      .insert("user", data, name)
      .execute(QueryTypes.INSERT);
    return null;
  }

  async update(id: number, data: SongDTO, name: string) {
    await this.queryBuilder
      .update("user", data, name)
      .where({
        id,
      })
      .execute(QueryTypes.UPDATE);
    return null;
  }

  async delete(id: number, name: string) {
    const user = await this.queryBuilder
      .update("user", {
        deleted_at: dayjs().format("YYYY-MM-DD HH:mm:ss ZZ"),
        deleted_by: name,
      })
      .where({
        id,
      })
      .execute(QueryTypes.UPDATE);
    return user;
  }
}
