'use strict';

const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Sequelize.Model { }
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a title.'
        },
        notNull: {
          msg: 'Please provide a title.'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a description.'
        },
        notNull: {
          msg: 'Please provide a description.'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },
  }, { sequelize });

  // Define associations 
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};