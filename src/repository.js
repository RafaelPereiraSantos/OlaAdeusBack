require('dotenv').config();
const token = require('./token')

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

const mongo = require('mongodb');
const client = mongo.MongoClient;
const database = process.env.MONGO_DATABASE;
const user_collection = 'users';
const punch_collection = 'punches';
const url = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/';

function withConnection(success) {
  client.connect(url, { poolSize: 10 }, (err, con) => {
    if (err) throw err
    const resp = success(con);
    return resp;
  });
};

function createCollections() {
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
};

function getUserByEmail(email, then) {
  withConnection((con) => {
    const db = con.db(database);
    const filter = { email: email };
    db.collection(user_collection).findOne(filter, (err, res) => {
      con.close();
      return then(err, res);
    });
  });
};

function getUserByEmailAndPassword(email, password, then) {
  withConnection((con) => {
    const db = con.db(database);
    const filter = { email: email, password: password };
    db.collection(user_collection).findOne(filter, (err, res) => {
      con.close();
      return then(err, res);
    });
  });
};

function getUserBySlug(slug, then) {
  withConnection((con) => {
    const db = con.db(database);
    const filter = { slug: slug };
    db.collection(user_collection).findOne(filter, (err, res) => {
      con.close();
      return then(err, res);
    });
  });
}

function saveUser(name, email, password, then) {
  const save = (slug) => {
    withConnection((con) => {
      const db = con.db(database);
      const new_user = { name: name, email: email, password: password, slug: slug };
      db.collection(user_collection).insertOne(new_user, (err, res) => {
        con.close();
        return then(err, res);
      });
    })
  }

  let error = null;

  const generateSlug = (slug) => {
    const normalized_name = name.split(' ').filter((value) => value).join('-');
    getUserBySlug(normalized_name, (err, res) => {
      if (err) {
        return then(err, res);
      } else if (res) {
        const new_slug_attempt = token.generate(normalized_name);
        generateSlug(new_slug_attempt);
      } else {
        save(normalized_name);
      }
    })
  };

  generateSlug(name);
};

function userPunches(user, day, then) {
  withConnection((con) => {
    const db = con.db(database);
  });
};

function allUserPunches(id, then) {
  withConnection((con) => {
    const db = con.db(database);
    const filter = { _id: id };
    db.collection(punch_collection).find(filter, (err, res) => {
      con.close();
      return then(err, res);
    });
  });
};

function savePunch(user_slug, time, type, then) {
  withConnection((con) => {
    const db = con.db(database);
    const new_punch = { user: user_slug, time: time, type: type };
    db.collection(punch_collection).insertOne(new_punch, (err, res) => {
      con.close();
      return then(err, res);
    });
  });
};


module.exports = {
  createCollections: createCollections,
  getUserByEmail: getUserByEmail,
  getUserByEmailAndPassword: getUserByEmailAndPassword,
  saveUser: saveUser,
  userPunches: userPunches,
  allUserPunches: allUserPunches,
  savePunch: savePunch,
  getUserBySlug: getUserBySlug
};
