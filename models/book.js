'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Book.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Can't be empty, please provide a title"
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "'Author' is required"
                }
            }
        },
        genre: DataTypes.STRING,
        year: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Book',
    });
    return Book;
};