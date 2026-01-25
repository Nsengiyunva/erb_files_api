import Sequelize from 'sequelize';
import DocumentModel from './Document.js'; // rename import

const sequelize = new Sequelize(
  "erbdb",
  "erbadmin",
  "admin@NSE#256",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { freezeTableName: true, underscored: true },
  }
);

// Initialize the model
const Document = DocumentModel(sequelize, Sequelize.DataTypes);

export {
  sequelize,
  Document
};