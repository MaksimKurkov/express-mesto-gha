const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUserById);

module.exports = router;
