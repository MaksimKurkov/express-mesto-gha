const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);

router.get('/users', getUsers);
// router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserData);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(),
  }),
}), updateUserAvatar);

router.get('/me', getUserById);

module.exports = router;
