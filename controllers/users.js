const mongoose = require('mongoose');
const userModel = require('../models/user');

module.exports.getUsers = (req, res) => {
  return userModel.find({})
    .then((r) => {
      res.status(200).send(r);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((r) => { return res.status(201).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((r) => { return res.status(200).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((r) => { return res.status(200).send(r) })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
