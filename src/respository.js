const mysql = require('mysql');
const host = process.env.MYSQL_HOST
const port = process.env.MYSQL_PORT
const user = process.env.MYSQL_USER
const pass = process.env.MYSQL_PASSWORD

const con = mysql.createConnection({
  host: host,
  port: port,
  user: user,
  password: pass
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = {

};
