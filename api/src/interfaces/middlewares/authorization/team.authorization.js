const boom = require('@hapi/boom');

const { teamService, workspaceMemberService, projectMemberService } = require('../../../application/services/index');
const { LIMITS } = require('./workspace.authorization');

async function authorizationToCreateTeam(req, res, next){
  try {
    const user = req.user;
    const workspaceMember = req.workspaceMember;
    if(!user) throw boom.unauthorized('User not authenticated');

    const count = await teamService.countTeams(workspaceMember.id);
    if(user.role === 'basic' && count >= LIMITS.BASIC.TEAMS){
      throw boom.forbidden('The team limit for basic users to create teams has been reached');
    }
    if(user.role === 'premium' && count >= LIMITS.PREMIUM.TEAMS){
      throw boom.forbidden('The team limit for premium users to create teams has been reached');
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function checkTeamMembership(req, res, next){
  try {
    const user = req.user;
    const { workspaceId, teamId } = req.params;

    const teamMember = await teamService.getTeamMemberByUserId(user.sub, workspaceId, teamId);
    if(!teamMember?.id) throw boom.notFound('You do not belong to the team');
    if(teamMember.role === 'member') throw boom.forbidden('You do not have permission to perform this action');

    req.teamMember = teamMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkAdminRoleToAssign(req, res, next){
  try {
    const userId = req.user.sub;
    const { workspaceId, projectId } = req.params;

    const workspaceMember = await workspaceMemberService.getWorkspaceMemberByUserId(workspaceId, userId);
    if(!workspaceMember?.id) throw boom.forbidden('You do not belong in the workspace');

    if(workspaceMember.role !== 'member'){
      req.workspaceMember = workspaceMember;
      return next();
    } else if(workspaceMember.role === 'member'){
      const projectMember = await projectMemberService.getProjectMemberByUserId(userId, workspaceId, projectId);
      if(!projectMember?.id) throw boom.forbidden('You do not belong in the project');
      if(projectMember.role !== 'admin') throw boom.forbidden('You do not have permission to perform this action');

      req.projectMember = projectMember;
      return next();
    }

    throw boom.forbidden('You do not have permission to perform this action');
  } catch (error) {
    next(error);
  }
}

async function checkTeamOwnership(req, res, next){
  try {
    const user = req.user;
    const { workspaceId, teamId } = req.params;

    const teamMember = await teamService.getTeamMemberByUserId(user.sub, workspaceId, teamId);
    if(!teamMember?.id) throw boom.forbidden('You do not belong to the team');
    if(teamMember.role !== 'owner') throw boom.forbidden('You do not have permission to perform this action');

    req.teamMember = teamMember;
    next();
  } catch (error) {
    next(error);
  }
}

async function checkAdminRole(req, res, next){
  try {
    const user = req.user;
    const { workspaceId, teamId } = req.params;

    const teamMember = await teamService.getTeamMemberByUserId(user.sub, workspaceId, teamId);
    if(teamMember.role === 'member') throw boom.forbidden('You do not have permission to perform this action');

    req.teamMember = teamMember;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authorizationToCreateTeam,
  checkAdminRoleToAssign,
  checkTeamMembership,
  checkTeamOwnership,
  checkAdminRole
};
