const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const port = 3000;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Монго подключена');
});

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64eb46f39adeceb59cc3fceb', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not found path' });
});

app.listen(port, () => {
  console.log(`Запущен порт ${port}`);
});
