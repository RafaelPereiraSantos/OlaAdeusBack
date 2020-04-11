require('dotenv').config();

const port = process.env.PORT;
const secrets = process.env.SESSION_SECRET;
const redis_port = process.env.REDIS_PORT

const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(session({
    secret: secrets,
    store: new redisStore({
      client: redis.createClient({ host: 'redis', port: redis_port })
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 10
    }
}));
app.use(require('./routes'));

app.listen(port, () => console.log(`Service up on port: ${port}`));

module.exports = app;