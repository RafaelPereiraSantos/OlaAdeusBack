const express = require('express');
const router = express.Router();
const repository = require('./repository')

function authorizedRequest(req, res, next){
  const unlogged_routes = ['/sign-in', '/sign-up', '/health'];
  const require_sign_in = unlogged_routes.indexOf(req.path) == -1;
  const did_not_signed = req.session.email == null;

  if (require_sign_in && did_not_signed) {
    console.log('Unauthorized');
    return res.status(401).end();
  };

  console.log('Authorized');
  next();
}

router.use(authorizedRequest);

router.get('/health', (req, res) => {
  return res.status(200).send("I'm fine, thanks for asking!");
});

router.post('/sign-up', (req, res) => {
  const body = req.body;
  let errors = [];

  addError = (field, message) => errors.push({ field: field, error_message: message });

  const name = body.name;
  if (!name) {
    addError('name', 'name required');
  }

  const email = body.email;
  if (!email) {
    addError('email', 'email required');
  }

  const password = body.password;
  if (!password) {
    addError('password', 'password required');
  }

  if (repository.getUserByEmail(email)) {
    addError('email', 'already in use');
  }

  if (errors.length > 0) {
    return res.status(400).send({ errors: errors });
  }

  const success = repository.saveUser(name, email, password);

  if (success) {
    req.session.email = email;
    return res.status(200).end();
  }

  res.status(400).end('whoopsie');
});

router.post('/sign-in', (req, res) => {
  const body = req.body;
  const email = body.email_address;
  const password = body.password;

  if (!email || !password) {
    return res.status(400).send({
      error_message: 'Email and password required'
    });
  }

  repository.getUserByEmailAndPassword(email, password, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }

    if (!user) {
      return res.status(400).send({
        error_message: 'Email or password incorreclty'
      });
    }

    req.session.email = email;
    return res.status(200).send(user);
  });
});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.status(200).end('done');
});

router.get('/user', (req, res) => {
  const email = req.session.email;
  const user = repository.getUserByEmail(email, (err, user) => {
    if (!user) return res.status(404).end();
    res.status(200).send({
      name: user.name,
      email: user.email
    });
  });
});

router.post('/punch', (req, res) => {
  res.status(201).end('done');
});

router.get('/punches', (req, res) => {
  res.status(200).send(
    [
      {
        description: 'Entrada',
        time: '12:00'
      },
      {
        description: 'Saida Almoço',
        time: '12:00'
      },
      {
        description: 'Volta Almoço',
        time: '12:00'
      },
      {
        description: 'Saida',
        time: '12:00'
      }
    ]
  );
});

module.exports = router;