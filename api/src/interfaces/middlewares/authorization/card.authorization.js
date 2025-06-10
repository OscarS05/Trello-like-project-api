const boom = require('@hapi/boom');
const {
  cardService,
  checklistService,
} = require('../../../application/services/index');

const validateCardAuthorization = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { listId, cardId } = req.params;

    const card = await cardService.checkProjectMemberByCardAndList(
      userId,
      listId,
      cardId,
    );
    if (!card?.id) throw boom.notFound('Something went wrong with data');

    next();
  } catch (error) {
    next(error);
  }
};

const checkAdminRoleInProjectByCard = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { cardId } = req.params;

    const projectMember = await cardService.getProjectMemberByCard(
      userId,
      cardId,
    );
    if (!projectMember?.id)
      throw boom.forbidden(
        'Something went wrong with data. UserId does not belong to the project',
      );
    if (projectMember.role === 'member')
      throw boom.forbidden('ProjectMember does not have permissions');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
};

const checkProjectMembershipByCard = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { cardId } = req.params;

    const projectMember = await cardService.getProjectMemberByCard(
      userId,
      cardId,
    );
    if (!projectMember?.id)
      throw boom.forbidden('Something went wrong with data');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
};

const checkProjectMembershipByChecklist = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { checklistId } = req.params;

    const projectMember = await checklistService.getProjectMemberByChecklist(
      userId,
      checklistId,
    );
    if (!projectMember?.id)
      throw boom.forbidden('You do not belong to the project');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCardAuthorization,
  checkAdminRoleInProjectByCard,
  checkProjectMembershipByCard,
  checkProjectMembershipByChecklist,
};
