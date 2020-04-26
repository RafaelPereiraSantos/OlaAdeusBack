require('dotenv').config();

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

const mongo = require('mongodb');
const client = mongo.MongoClient;
const database = process.env.MONGO_DATABASE;
const user_collection = 'users';
const punch_collection = 'punches';
const url = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/';

const withConnection = (success) => {
  client.connect(url, { poolSize: 10 }, (err, con) => {
    if (err) throw err
    const resp = success(con);
    return resp;
  });
};

const repository = {

  createCollections() {
    const createCollection = (collection) => {
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
    }

    createCollection(user_collection);
    createCollection(punch_collection);
  },

  getUserByEmail(email, then) {
    withConnection((con) => {
      const db = con.db(database);
      const filter = { email: email };
      db.collection(user_collection).findOne(filter, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  },

  getUserByEmailAndPassword(email, password, then) {
    withConnection((con) => {
      const db = con.db(database);
      const filter = { email: email, password: password };
      db.collection(user_collection).findOne(filter, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  },

  saveUser(name, email, password, then) {
    withConnection((con) => {
      const db = con.db(database);
      const new_user = { name: name, email: email, password: password };
      db.collection(user_collection).insertOne(new_user, (err, res) => {
        con.close();
        return then(err, res);
      });
    })
  },

  userPunches(user, day, then) {
    withConnection((con) => {
      const db = con.db(database);
    });
  },

  allUserPunches(user, then) {
    withConnection((con) => {
      const db = con.db(database);
      const filter = { user: user };
      db.collection(punch_collection).find(filter, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  },

  savePunch(user_slug, time, type, then) {
    withConnection((con) => {
      const db = con.db(database);
      const new_punch = { user: user_slug, time: time, type: type };
      db.collection(punch_collection).insertOne(new_punch, (err, res) => {
        con.close();
        return then(err, res);
      });
    });
  }
};


module.exports = repository;
