const mongoose = require('mongoose');
const cardModel = require('../models/card');

module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then((r) => {
      res.status(200).send(r);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((r) => {
      res.status(201).send(r);
    })
    .catch((e) => {
      console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      console.log(e);
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.addCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (!r) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(r);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Неверные данные' });
      }
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
