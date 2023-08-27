const userModel = require('../models/user');
const { makeNotFounError, checkErrors } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((r) => { res.send(r); })
    .catch((err) => {
      checkErrors(err, res);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
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
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((r) => { res.status(201).send(r); })
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
