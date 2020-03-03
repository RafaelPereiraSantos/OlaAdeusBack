const express = require('express');
const router = express.Router();
// const repository = require('./repository')

function authorizedRequest(req, res, next){
  const unlogged_routes = ['/sign-in', 'health'];
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

  function addError(field, message) {
    errors.push({ field: field, error_message: message });
  }

  if (!body.name) {
    addError('name', 'name required');
  }

  if (!body.email) {
    addError('email', 'email required');
  }

  if (!body.password) {
    addError('password', 'password required');
  }

  if (errors.length > 0) {
    return res.status(400).send(errors);
  } else {
    req.session.email = req.body.email;

    const user_payload = {
      user: {
        name: body.name
      }
    };

    return res.status(200).send(user_payload);
  }
});

router.post('/sign-in', (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const valid_user = typeof password !== 'undefined';

  if (!valid_user) {
    return res.status(401).send({ error_message: 'Email or password incorrectly' });
  }

  req.session.email = email;
  return res.status(200).end('done');
});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.status(200).end('done');
});

router.post('/punch', (req, res) => {
  console.log(req.session);
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