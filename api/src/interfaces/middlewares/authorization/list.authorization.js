const boom = require('@hapi/boom');
const { cardService, listService } = require('../../../application/services/index');

const validateListAuthorization = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { listId } = req.params;

    const list = await listService.projectMembershipByList(userId, listId);
    if(!list?.id) throw boom.notFound('Something went wrong with data');

    req.list = list;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateListAuthorization,
}
