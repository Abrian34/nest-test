require("ts-node").register({ transpileOnly: true });
import { Dialect } from "sequelize";
// import { IDatabaseConfig } from "../shared/interfaces/db-config.interface";
import { Logger } from "@nestjs/common";

// const envConfig = new EnvConfig();

// const createConfig = (): IDatabaseConfig => {
//   const commonConfig = {
//     username: "postgres",
//     password: "1234",
//     database: "TestDB",
//     host: "localhost",
//     port: +"5432",
//     dialect: "postgres",
//     logging: false,
//   };

//   Logger.log(
//     `Using database: ${commonConfig.database} on ${commonConfig.host}:${commonConfig.port}`,
//     "DatabaseConfig",
//   );

//   return {
//     development: commonConfig,
//     staging: commonConfig,
//     production: commonConfig,
//   };
// };

const commonConfig = {
    username: "postgres",
    password: "1234",
    database: "TestDB",
    host: "localhost",
    port: +"5432",
    dialect: "postgres",
    logging: false,
  };

  Logger.log(
    `Using database: ${commonConfig.database} on ${commonConfig.host}:${commonConfig.port}`,
    "DatabaseConfig",
  );

// const config: IDatabaseConfig = createConfig();

export = commonConfig;
