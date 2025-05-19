const boom = require('@hapi/boom');
const {
  listService,
  projectMemberService,
  workspaceMemberService,
} = require('../../../application/services/index');

const validateListAuthorization = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { listId } = req.params;

    const list = await listService.projectMembershipByList(userId, listId);
    if (!list?.id) throw boom.notFound('Something went wrong with data');

    req.list = list;
    next();
  } catch (error) {
    next(error);
  }
};

const validateProjectReadPermission = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { listId } = req.params;

    const listWithItsProject = await listService.getProjectByList(listId);
    if (!listWithItsProject?.id)
      throw boom.notFound('Something went wrong with data');

    if (listWithItsProject.project?.visibility === 'private') {
      const projectMember =
        await projectMemberService.checkProjectMembershipByUser(
          userId,
          listWithItsProject.project.id,
        );
      if (!projectMember?.id)
        throw boom.forbidden(
          'You do not have permission to access this project. You do not belong to the project',
        );
      return next();
    }

    if (listWithItsProject.project?.visibility === 'workspace') {
      const workspaceMember =
        await workspaceMemberService.getWorkspaceMemberByUserId(
          listWithItsProject.project.workspaceId,
          userId,
        );
      if (!workspaceMember?.id)
        throw boom.forbidden(
          'You do not have permission to access this project. You do not belong to the workspace',
        );
      return next();
    }

    throw boom.badRequest('Invalid project visibility');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateListAuthorization,
  validateProjectReadPermission,
};
