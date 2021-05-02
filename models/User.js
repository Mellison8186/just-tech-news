const { Model, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const sequelize = require("../config/connection");

class User extends Model {
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
  {
      id: {
          // use the special Sequelize DataTypes object to provide what type of data it is
          type: DataTypes.INTEGER,
          // this is the equivelant of SQL's `NOT NULL` option
          allowNull: false,
          // instruct that this is a Primary Key
          primaryKey: true,
          // turn on auto increment
          autoIncrement: true,
      },
      username: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          // there cannot be any duplciate email valudes in this table
          unique: true,
          // if allowNull is set to false, run data through validators before table creation
          validate: {
              isEmail: true,
          },
      },
      //define a password column
      password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [4],
          },
      },
  },
  {
      hooks: {
          //set up beforeCreate lifecycle "hook" functionality
          async beforeCreate(newUserData) {
              newUserData.password = await bcrypt.hash(newUserData.password, 10);
              return newUserData;
          },
          //set up beforeUpdate lifecycle "hook" functionality
          async beforeUpdate(updatedUserData) {
              updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
              return updatedUserData;
          }
      },
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;