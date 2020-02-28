const express = require('express');
const router = express.Router();
// const repository = require('./repository')

function authorizedRequest(req, res, next){
  let sess = req.session;
  console.log(req);
  let require_sign_in = ['/sign-in', 'health'].indexOf(req.path) == -1;
  let didn_not_signed = sess.email == null;

  if (require_sign_in && didn_not_signed) {
    console.log('Unauthorized');
    return res.status(401).end();
  };

  console.log('Authorized');
  next();
}

// router.use(authorizedRequest);

router.get('/health', (req, res) => {
  return res.status(200).send("I'm fine, thanks for asking!");
});

router.post('/sign-in', (req, res) => {
  req.session.email = req.body.email;
  res.status(200).end('done');
});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.status(200).end('done');
});

router.post('/punch', (req, res) => {
  res.status(200).end('done');
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

router.get('/', (req, res) => {
  let sess = req.session;
  return res.status(200).send('ok');
});

module.exports = router;