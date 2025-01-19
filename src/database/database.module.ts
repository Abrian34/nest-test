import { Global, Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";
import "dotenv/config";

import { QueryBuilder } from "./query-builder";
import commonConfig from "src/config/database.config";

@Global()
@Module({
  imports: [
    // SequelizeModule.forRootAsync({
    //   useFactory: async () => {
    //     // const sequelizeConfig = config[new EnvConfig().get("NODE_ENV")];
    //     // const sequelizeConfig = commonConfig;
    //     // sequelizeConfig.logging = (msg: any) => Logger.log(msg, "Sequelize");
    //     // const sequelize = new Sequelize(commonConfig);

    //     const sequelize = new Sequelize('TestDB', 'postgres', '1234', {
    //       host: 'localhost',
    //       dialect: 'postgres'
    //     });

    //     try {
    //       await sequelize.authenticate();
    //       Logger.log(
    //         `Connected to database: ${sequelize.getDatabaseName()} on ${sequelize.getDialect}`,
    //         "DatabaseModule",
    //       );
    //     } catch (error) {
    //       Logger.error(
    //         `Unable to connect to the database: ${error.message}`,
    //         "DatabaseModule",
    //       );
    //     }
    //     return sequelize;
    //   },
    // }),
  ],
  providers: [QueryBuilder],
  exports: [QueryBuilder, SequelizeModule],
})
export class DatabaseModule {}
