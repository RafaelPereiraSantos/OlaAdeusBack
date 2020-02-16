const express = require('express');
const router = express.Router();
const repository = require('./repository')

router.get('/health', (req, res) => {
  return res.status(200).send("I'm fine, thanks for asking!");
});

router.post('/sign-in', (req, res) => {
  res.status(200).end('done');
});

router.post('/sign-out', (req, res) => {
  res.status(200).end('done');
});

router.post('/punch', (req, res) => {
  res.status(200).end('done');
});

router.get('/punches', (req, res) => {
  console.log('request');
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

module.exports| = router;