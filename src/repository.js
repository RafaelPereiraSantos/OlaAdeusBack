var mongo = require('mongodb');

const host = process.env.MONGO_HOST
const port = process.env.MONGO_PORT
const database = process.env.MONGO_DATABASE


// TODO create a real connection with mysql maybe with X DevAPI

const mockUserReponse = {
  id: 1,
  name: 'test user',
  email: 'test@email.com',
  created_at: '2020-01-01'
}

const repository = {

  getUserByEmail(email) {
    if (email == 'test@email.com') {
      return(mockUserReponse);
    }
  },

  getUserByEmailAndPassword(email, password) {
    if (email == 'test@email.com' && password == 'secret-pass') {
      return(mockUserReponse);
    }
  },

  saveUser(name, email, password) {
    return true;
  }
};


module.exports = repository;
