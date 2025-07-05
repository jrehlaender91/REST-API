'use strict';

const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Sequelize.Model { }
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, { sequelize });

  // Define associations 
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  };

  return Course;
};

/* Set up the foreignKey property with the name userId, 
and set it equal to the id from the Users table. */