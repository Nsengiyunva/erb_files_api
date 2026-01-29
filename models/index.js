import Sequelize from 'sequelize';
import DocumentModel from './Document.js'; // rename import
import ERBPaidModel from './ERBPaid.js';

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

const Document = DocumentModel(sequelize, Sequelize.DataTypes);
const ERBPaidList = ERBPaidListModel(sequelize, Sequelize.DataTypes);

export {
  sequelize,
  Document,
  ERBPaidList
}