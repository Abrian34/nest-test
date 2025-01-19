import { Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import * as dayjs from "dayjs";

@Injectable()
export class QueryBuilder {
  private query: string;
  private parameters: any[];

  constructor(private sequelize: Sequelize) {
    this.query = "";
    this.parameters = [];
  }

  select(columns: string[] | string): this {
    const columnString = Array.isArray(columns) ? columns.join(", ") : columns;
    this.query = `SELECT ${columnString}`;
    return this;
  }

  // transaction
  update(table: string, data: Record<string, any>, name?: string): this {
    const setString = Object.entries(data).map(([key, value]) => {
      this.parameters.push(value);
      return `${key} = ?`;
    });
    this.query = `UPDATE "${table}" SET ${setString.join(", ")}`;

    if (name) {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss ZZ");
      this.query += `, updated_at = '${now}', updated_by = '${name}'`;
    }

    return this;
  }

  from(table: string): this {
    this.query += ` FROM "${table}"`;
    return this;
  }

  where(conditions: Record<string, any>): this {
    this.query += ` WHERE deleted_at IS NULL`;
    const conditionStrings = Object.entries(conditions).map(([key, value]) => {
      if (value === null) {
        return `${key} IS NULL`;
      } else if (Array.isArray(value)) {
        this.parameters.push(...value);
        return `${key} IN (${value.map(() => "?").join(", ")})`;
      } else {
        this.parameters.push(value);
        return `${key} = ?`;
      }
    });
    if (conditionStrings.length > 0) {
      this.query += ` AND ${conditionStrings.join(" AND ")}`;
    }
    return this;
  }

  search(columns: string[], search: string): this {
    const searchString = `%${search}%`;
    const searchStrings = columns.map((column) => {
      this.parameters.push(searchString);
      return `${column} ILIKE ?`;
    });
    this.query += ` AND (${searchStrings.join(" OR ")})`;
    return this;
  }

  orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.query += ` ORDER BY ${field} ${direction}`;
    return this;
  }

  limit(limit: number): this {
    this.query += ` LIMIT ${limit}`;
    return this;
  }

  offset(offset: number): this {
    this.query += ` OFFSET ${offset}`;
    return this;
  }

  // transaction
  insert(table: string, data: Record<string, any>, name: string): this {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(", ");
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss ZZ");

    this.query = `INSERT INTO "${table}" 
    (created_at, created_by, updated_at, updated_by, ${columns}) 
    VALUES 
    ('${now}', '${name}', '${now}', '${name}', ${placeholders})`;
    this.parameters = values;

    return this;
  }

  async execute(type: QueryTypes): Promise<any> {
    try {
      const results = await this.sequelize.query(this.query, {
        replacements: this.parameters,
        type,
      });

      // Reset parameters
      this.parameters = [];

      return results;
    } catch (error) {
      throw new Error(`Error executing query: ${error.message}`);
    }
  }
}
