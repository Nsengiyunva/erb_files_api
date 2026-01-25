export default (sequelize, DataTypes) => {
    const Document = sequelize.define(
      'Document',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        filename: {
          type: DataTypes.STRING,
          allowNull: false
        },
        filepath: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          unique: true
        },        
        filesize: {
          type: DataTypes.BIGINT
        }
      },
      {
        tableName: 'erb_uploaded_documents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
      }
    );
  
    return Document;
  };
  