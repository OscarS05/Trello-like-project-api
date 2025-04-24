const express = require('express');
const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { createUserSchema, userIdSchema } = require('../schemas/user.schema');

const userController = require('../controllers/user.controller');

router.get('/:email',
  userController.getUserByEmail
);

router.get('/',
  userController.getUsers
);

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  userController.signUp
);

router.delete('/:userId',
  validateSession,
  validatorHandler(userIdSchema, 'params'),
  userController.deleteAccount
);

module.exports = router;
