let sequelize;

if (process.envJAWSDB_URL) {
  sequelize = new Sequelize(process.env.envJAWSDB_URL);
} else {
// create connection to our db
sequelize = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});
}

module.exports = sequelize;