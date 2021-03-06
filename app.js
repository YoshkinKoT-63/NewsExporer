require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const routes = require('./routes');

const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsHandler } = require('./middlewares/errors-handler');

const app = express();

const { DATABASE, PORT } = require('./config');

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors);

app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`сервер запущен на ${PORT} порту`);
});
