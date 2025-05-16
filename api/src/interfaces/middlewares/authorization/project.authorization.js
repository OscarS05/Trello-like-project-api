const boom = require('@hapi/boom');

const {
  projectService,
  projectMemberService,
  workspaceMemberService,
} = require('../../../application/services/index');
const { LIMITS } = require('./workspace.authorization');

async function authorizationToCreateProject(req, res, next) {
  try {
    const user = req.user;
    const workspaceMember = req.workspaceMember;
    const count = await projectService.countProjects(workspaceMember);

    if (user.role === 'basic' && count >= LIMITS.BASIC.PROJECTS) {
      throw boom.forbidden('Project limit reached for basic users');
    }
    if (user.role === 'premium' && count >= LIMITS.PREMIUM.PROJECTS) {
      throw boom.forbidden('Project limit reached for premium users');
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function checkProjectMembership(req, res, next) {
  try {
    const user = req.user;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(
      user.sub,
      workspaceId,
      projectId
    );
    if (!projectMember?.id)
      throw boom.forbidden('You do not belong to the workspace');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkAdminRole(req, res, next) {
  try {
    const userId = req.user.sub;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(
      userId,
      workspaceId,
      projectId
    );

    if (!projectMember?.id)
      throw boom.forbidden('You do not belong to the project');
    if (projectMember.projectId !== projectId)
      throw boom.forbidden('You do not belong to the project');
    if (projectMember.role === 'member')
      throw boom.forbidden('You do not have permission to perform this action');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkOwnership(req, res, next) {
  try {
    const user = req.user;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(
      user.sub,
      workspaceId,
      projectId
    );
    if (!projectMember?.id)
      throw boom.forbidden('You do not belong to the project');
    if (projectMember.role !== 'owner')
      throw boom.forbidden('You do not have permission to perform this action');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkProjectMembershipByUserId(req, res, next) {
  try {
    const user = req.user;
    const { projectId } = req.params;

    const projectMember =
      await projectMemberService.checkProjectMembershipByUser(
        user.sub,
        projectId
      );
    if (!projectMember?.id)
      throw boom.forbidden('You do not belong to the project');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function validateProjectReadPermission(req, res, next) {
  try {
    const user = req.user;
    const { projectId } = req.params;

    const project = await projectService.getProjectById(projectId);
    if (!project?.id) throw boom.forbidden('You do not belong to the project');

    if (project.visibility === 'private') {
      const projectMember =
        await projectMemberService.checkProjectMembershipByUser(
          user.sub,
          projectId
        );
      if (!projectMember?.id)
        throw boom.forbidden('You do not belong to the project');

      return next();
    }

    if (project.visibility === 'workspace') {
      const workspaceMember =
        await workspaceMemberService.getWorkspaceMemberByUserId(
          project.workspaceId,
          user.sub
        );
      if (!workspaceMember?.id)
        throw boom.forbidden('You do not belong to the project');

      return next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkAdminRole,
  checkProjectMembership,
  authorizationToCreateProject,
  checkOwnership,
  checkProjectMembershipByUserId,
  validateProjectReadPermission,
};
