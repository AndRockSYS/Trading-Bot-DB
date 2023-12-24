const express = require('express');
const router = express.Router();

const apiKey = 'tradingBot';

let [getUser, setUser, deleteUser] = require('../interactWithDb');

router.all('*', (req, res, next) => {
  console.log(req.query)
  req.query.api == apiKey ? next() : res.send(false);
});

router.get('/:username', async (req, res) => {
  let username = req.params.username;
  let data = await getUser(username);
  res.send(data);
});

router.post('/', async (req, res) => {
  let body = req.body;
  let data = await setUser(body.username, body.address, body.privateKey);
  res.send(data);
});

router.delete('/:username', async (req, res) => {
  let username = req.params.username;
  let data = await deleteUser(username);
  res.send(data);
});

module.exports = router;