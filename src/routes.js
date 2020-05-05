const express = require('express');
const router = express.Router();
const repository = require('./repository')

function authorizedRequest(req, res, next) {
  const unlogged_routes = ['/sign-in', '/sign-up', '/health'];
  const require_sign_in = unlogged_routes.indexOf(req.path) == -1;
  const did_not_signed = req.session.email == null;

  if (require_sign_in && did_not_signed) {
    console.log('Unauthorized');
    return res.status(401).end();
  };

  console.log('Authorized');
  next();
};

function punchRepresentation(punch) {
  return {
    id: punch._id,
    date: punch.date,
    time: punch.time,
    type: punch.punch_type,
    user_id: punch.user_id
  };
};

function userRepresentation(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    slug: user.slug
  };
};

router.use(authorizedRequest);

router.get('/health', (req, res) => {
  return res.status(200).send("I'm fine, thanks for asking!");
});

router.post('/sign-up', (req, res) => {
  const body = req.body;
  let errors = [];

  const addError = (field, message) => {
    errors.push({ field: field, error_message: message });
  }

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

  if (errors.length > 0) {
    return res.status(400).send({ errors: errors });
  }

  try {
    repository.getUserByEmail(email, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      if (user) {
        addError('email', 'already in use');
        return res.status(400).send({ errors: errors });
      } else {
        repository.saveUser(name, email, password, (err, new_user) => {
          if (err || !new_user) {
            res.status(500).end();
          } else {
            req.session.email = email;
            res.status(201).send(userRepresentation(new_user));
          }
        });
      }
  });
  } catch(e) {

  }
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
    return res.status(200).send(userRepresentation(user));
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
    console.log(user);
    res.status(200).send(userRepresentation(user));
  });
});

router.post('/punch', (req, res) => {
  const body = req.body;

  const user_id = body.user_id;
  const date = body.date;
  const time = body.time;
  const punch_type = body.type;

  if (!user_id || !date || !time || !punch_type) {
    return res.status(400).send({
      error_message: 'user_id, date, time and type are required in payload'
    });
  }

  if (new Date(date + ' ' + time) == 'Invalid Date') {
    return res.status(400).send({
      error_message: 'bad format for: date or time'
    });
  }

  repository.savePunch(user_id, date, time, punch_type, (err, punch) => {
    if (err) {
      return res.status(500).end();
    }
    res.status(201).send(punchRepresentation(punch));
  });
});

router.get('/user/:user_slug/punches', (req, res) => {
  const user_slug = req.params.user_slug;

  const respond_request = (err, punches) => {
    if (err) return res.status(500).end();
    const status = punches.length == 0 ? 404 : 200;
    res.status(status).send(punches.map((punch) => punchRepresentation(punch)))
  };

  repository.getUserBySlug(user_slug, (err, user) => {
    if (err) return res.status(500).end();

    if (user) {
      if (err) return res.status(500).end();
      repository.userPunches(user._id, req.query.date, respond_request);
    } else {
      res.status(404).end();
    }
  });
});

module.exports = router;