const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const signinRouter = require('./routes/sign-in');
const signupRouter = require('./routes/sign-up');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-middlewares');
const NotFoundError = require('./errors/not-found-error');

const port = 3000;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Монго подключена');
});

app.use(signinRouter);
app.use(signupRouter);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Неверный путь!'));
});

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Запущен порт ${port}`);
});
