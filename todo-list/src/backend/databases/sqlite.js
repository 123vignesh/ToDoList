var Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/backend/databases/database.sqlite",
});


var users = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
 
});




var lists = sequelize.define("list", {
  item: {
    type: Sequelize.STRING,
  },
  edit: {
    type: Sequelize.BOOLEAN,
  },
  done: {
    type: Sequelize.STRING,
  },
  userID: {
    type: Sequelize.NUMBER,
  },
});


sequelize
  .sync()
  .then(() =>

    console.log(
      "table has been successfully created, if one doesn't exist"
    )
  )
  .catch((error) => console.log("This error occurred"));

let obj = {

  lists: lists,
  users: users
}


module.exports = obj;