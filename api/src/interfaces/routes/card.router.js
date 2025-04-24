const express = require('express');
const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { validateListAuthorization, validateProjectReadPermission } = require('../middlewares/authorization/list.authorization');
const { validateCardAuthorization } = require('../middlewares/authorization/card.authorization');
const { listIdSchema } = require('../schemas/list.schema');
const { cardSchemas, createCardSchema, updateCardSchema } = require('../schemas/card.schema');

const cardControllers = require('../controllers/card.controller');

router.get('/lists/:listId/cards/:cardId/information',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validateProjectReadPermission,
  cardControllers.getAllCardInformation
);

router.get('/lists/:listId/cards',
  validateSession,
  validatorHandler(listIdSchema, 'params'),
  validateListAuthorization,
  cardControllers.getCards
);

router.post('/lists/:listId/cards',
  validateSession,
  validatorHandler(listIdSchema, 'params'),
  validatorHandler(createCardSchema, 'body'),
  validateListAuthorization,
  cardControllers.createCard
);

router.patch('/lists/:listId/cards/:cardId',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validatorHandler(updateCardSchema, 'body'),
  validateCardAuthorization,
  cardControllers.updateCard
);

router.delete('/lists/:listId/cards/:cardId',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validateCardAuthorization,
  cardControllers.deleteCard
);


module.exports = router;
