require('dotenv').config();

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

const mongo = require('mongodb');
const client = mongo.MongoClient;
const database = process.env.MONGO_DATABASE;
const collection = 'users';
const url = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/';

const mockUserReponse = {
  id: 1,
  name: 'test user',
  email: 'test@email.com',
  created_at: '2020-01-01'
};

const withConnection = (success) => {
  client.connect(url, { poolSize: 10 }, (err, con) => {
    if (err) {
      console.log(err)
      return false;
    }
    const resp = success(con);
    return resp;
  });
};

const repository = {

  createCollection() {
    withConnection((con) => {
      const db = con.db(database);
      db.listCollections({ name: collection })
        .next((err, collinfo) => {
          if (!collinfo) {
            db.createCollection(collection, function(err, res) {
              if (err) throw err;
              con.close();
            });
          } else {
            con.close();
          }
      });
    })
  },

  getUserByEmail(email, then) {
    withConnection((con) => {
      const db = con.db(database);
      const filter = { email: email };
      db.collection(collection).findOne(filter, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  },

  getUserByEmailAndPassword(email, password, then) {
    withConnection((con) => {
      const db = con.db(database);
      const filter = { email: email, password: password };
      db.collection(collection).findOne(filter, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  },

  saveUser(name, email, password) {
    withConnection((con) => {
      const db = con.db(database);
      const new_user = { name: name, email: email, password: password };
      db.collection(collection).insertOne(new_user, (err, res) => {
        if(err) return false;
        con.close();
        return true;
      });
    })
    return false;
  }
};


module.exports = repository;
