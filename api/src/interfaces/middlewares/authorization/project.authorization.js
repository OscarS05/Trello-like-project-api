const boom = require('@hapi/boom');

const { projectService, projectMemberService } = require('../../../application/services/index');
const { LIMITS } = require('./workspace.authorization');

async function authorizationToCreateProject(req, res, next){
  try {
    const user = req.user;
    const workspaceMember = req.workspaceMember;
    const count = await projectService.countProjects(workspaceMember);

    if(user.role === 'basic' && count >= LIMITS.BASIC.PROJECTS){
      throw boom.forbidden('Project limit reached for basic users');
    }
    if(user.role === 'premium' && count >= LIMITS.PREMIUM.PROJECTS){
      throw boom.forbidden('Project limit reached for premium users');
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function checkProjectMembership(req, res, next){
  try {
    const user = req.user;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(user.sub, workspaceId, projectId);
    if(!projectMember?.id) throw boom.forbidden('You do not belong to the workspace');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkAdminRole(req, res, next){
  try {
    const userId = req.user.sub;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(userId, workspaceId, projectId);
    if(projectMember?.role === 'member') throw boom.forbidden('You do not have permission to perform this action');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkOwnership(req, res, next){
  try {
    const user = req.user;
    const { workspaceId, projectId } = req.params;

    const projectMember = await projectMemberService.getProjectMemberByUserId(user.sub, workspaceId, projectId);
    if(projectMember.role !== 'owner') throw boom.forbidden('You do not have permission to perform this action');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkProjectMembershipByUserId(req, res, next){
  try {
    const user = req.user;
    const { projectId } = req.params;

    const projectMember = await projectMemberService.checkProjectMembershipByUser(user.sub, projectId);
    if(!projectMember?.id) throw boom.forbidden('You do not belong to the project');

    req.projectMember = projectMember;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkAdminRole,
  checkProjectMembership,
  authorizationToCreateProject,
  checkOwnership,
  checkProjectMembershipByUserId
};
