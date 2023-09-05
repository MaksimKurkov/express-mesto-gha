const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex, emailRegex } = require('../utils/regex');

const {
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getMe,
  createUser,
  login,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserData);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(httpRegex).required(),
  }),
}), updateUserAvatar);

router.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(httpRegex),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
  }),
}), createUser);

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
  }),
}), login);

module.exports = router;
