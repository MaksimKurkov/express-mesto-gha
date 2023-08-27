function makeNotFounError() {
  const error = new Error();
  error.name = 'NotFound';
  throw error;
}

function checkErrors(err, res, messages = {}) {
  const msgNotFound = messages.msgNotFound || 'Поиск по id не дал результатов';
  const msgCastError = messages.msgCastError || 'Невалидный id';
  const msgValidationError = messages.msgValidationError || 'Переданы некорректные данные';

  if (err.name === 'NotFound') return res.status(404).send({ message: msgNotFound });
  if (err.name === 'CastError') return res.status(400).send({ message: msgCastError });
  if (err.name === 'ValidationError') return res.status(400).send({ message: msgValidationError });

  return res.status(500).send({ message: 'Ошибка на сервере' });
}

module.exports = {
  makeNotFounError,
  checkErrors,
};
