const cardModel = require('../models/card');
const { makeNotFounError, checkErrors } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then((r) => { res.status(200).send(r); })
    .catch((err) => {
      checkErrors(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((r) => {
      res.status(201).send({ r });
    })
    .catch((err) => {
      checkErrors(err, res, {
        msgValidationError: 'Переданы некорректные данные',
      });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .orFail(() => makeNotFounError())
    .then((r) => { res.status(200).send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Невалидный id карточки',
      });
    });
};

module.exports.addCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => makeNotFounError())
    .then((r) => { res.status(200).send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Переданы некорректные данные для постановки лайка',
      });
    });
};

module.exports.deleteCardLike = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => makeNotFounError())
    .then((r) => { res.status(200).send(r); })
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Переданы некорректные данные для снятия лайка',
      });
    });
};
