// config/database.js
module.exports = {
  dialect: "mysql",
  host: "localhost",
  username: "root",      
  password: "123456",          
  database: "calendario",
  define: {
    timestamps: true,
    underscored: true
  }
};