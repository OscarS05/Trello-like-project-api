const boom = require('@hapi/boom');

const { projectMemberService } =  require('../../application/services/index');

const getProjectMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const { projectMembers, teams } = await projectMemberService.getProjectMembersWithTeams(projectId);

    res.status(200).json({ projectMembers, teams });
  } catch (error) {
    next(error);
  }
}

const addMemberToProject = async (req, res, next) => {
  try {
    const{ projectId } = req.params;
    const { workspaceMemberId } = req.body;

    const addedMember = await projectMemberService.addMemberToProject(projectId, workspaceMemberId);
    if(!addedMember?.id) throw boom.badRequest('Add member operation does not return the added member');

    res.status(201).json({ message: 'Member was added successfully', addedMember });
  } catch (error) {
    next(error);
  }
}

const changeRoleToMember = async (req, res, next) => {
  try {
    const { workspaceId, projectId, projectMemberId } = req.params;
    const { newRole } = req.body;
    const requesterAsProjectMember = req.projectMember;

    if(requesterAsProjectMember.id === projectMemberId) throw boom.forbidden('You cannot update your own role in the project');
    const updatedMember = await projectMemberService.updateRole(projectMemberId, newRole);
    if(!updatedMember?.id) throw boom.badRequest('The update role operation returns null');

    res.status(200).json({ message: 'The role has been changed successfully', updatedMember });
  } catch (error) {
    next(error);
  }
}

const transferOwnership = async (req, res, next) => {
  try {
    const { workspaceId, projectId, projectMemberId: newProjectOwnerId } = req.params;
    const currentProjectOwner = req.projectMember;

    const updatedRows = await projectMemberService.transferOwnership(projectId, currentProjectOwner, newProjectOwnerId);
    if(updatedRows === 0) throw boom.notFound('The transfer ownership operation did not update any rows');

    res.status(200).json({ message: 'The transfer of ownership was successful', updatedRows });
  } catch (error) {
    next(error);
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { workspaceId, projectId, projectMemberId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const deletedMember = await projectMemberService.removeMemberController(projectId, projectMemberId, requesterAsProjectMember);
    if(deletedMember === 0) throw boom.badRequest('Failed to delete the member');

    res.status(200).json({ message: 'Member was removed successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProjectMembers,
  addMemberToProject,
  changeRoleToMember,
  transferOwnership,
  removeMember,
}
