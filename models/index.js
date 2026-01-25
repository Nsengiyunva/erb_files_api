import Sequelize from 'sequelize';
import Document from './Document.js';

const sequelize = new Sequelize(
  "erbdb",
  "erbadmin",
  "admin@NSE#256",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false, // disable SQL logs in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true, // prevent pluralization
      underscored: true,     // use snake_case columns
    },
  }
);

const Document = Document(sequelize, Sequelize.DataTypes);

export {
  sequelize,
  Document
};
