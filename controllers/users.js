const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { makeNotFounError, checkErrors } = require('../utils/utils');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET, JWT_DEV } = process.env;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((r) => { res.send(r); })
    .catch((err) => {
      checkErrors(err, res);
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.user._id;
  return userModel.findById(userId)
    .orFail(() => makeNotFounError())
    .then((r) => { res.send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь по указанному _id не найден',
        msgCastError: 'Невалидный id пользователя',
      });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.send({
      data: {
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      },
    }))
    .catch((err) => {
      checkErrors(err, res, {
        msgValidationError: 'Переданы некорректные данные при создании пользователя',
      });
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  return userModel.findByIdAndUpdate(userID, { name, about }, { new: true, runValidators: true })
    .orFail(() => makeNotFounError())
    .then((r) => { res.send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь с указанным _id не найден',
        msgCastError: 'Невалидный id пользователя',
        msgValidationError: 'Переданы некорректные данные при обновлении профиля',
      });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  return userModel.findByIdAndUpdate(userID, { avatar }, { new: true, runValidators: true })
    .orFail(() => makeNotFounError())
    .then((r) => { res.send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь с указанным _id не найден',
        msgCastError: 'Невалидный id пользователя',
        msgValidationError: 'Переданы некорректные данные при обновлении аватара',
      });
    });
};
