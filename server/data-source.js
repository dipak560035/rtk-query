require("reflect-metadata");
require("dotenv").config();

const { DataSource } = require("typeorm");

const User = require("./entities/User");
const Token = require("./entities/Token");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "dipak8080",
  database: "postgress_test",
  synchronize: true,   // auto-create tables (dev only)
  logging: false,
  entities: [User, Token],
});

module.exports = AppDataSource;
