'use strict';

const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Sequelize.Model { }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a first name.'
        },
        notNull: {
          msg: 'Please provide a first name.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a last name.'
        },
        notNull: {
          msg: 'Please provide a last name.'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address.'
        },
        notNull: {
          msg: 'Please provide an email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a password.'
        },
        notNull: {
          msg: 'Please provide a password.'
        },
        len: {
          args: [8, 20],
          msg: 'Password must be between 8 and 20 characters long.'
        },
        set(value) {
          // Hash the password before saving it to the database
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hashedPassword);
        }
      }
    }
  }, { sequelize });

  // Define associations 
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};