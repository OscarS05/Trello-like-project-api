const boom = require('@hapi/boom');

const { workspaceMemberService } = require('../../application/services/index');

const getworkspaceMembers = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const workspaceMembers =
      await workspaceMemberService.findAllWithData(workspaceId);

    res.status(200).json({ workspaceMembers });
  } catch (error) {
    next(error);
  }
};

const addMemberToWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const memberIdToAdd = req.body.userId;

    const addedMember = await workspaceMemberService.addMemberToWorkspace(
      workspaceId,
      memberIdToAdd,
    );
    if (!addedMember)
      throw boom.badRequest('Add member to workspace operations returns null');

    res.status(201).json({ message: 'Member added successfully', addedMember });
  } catch (error) {
    next(error);
  }
};

const changeRoleToMember = async (req, res, next) => {
  try {
    const { workspaceId, workspaceMemberId } = req.params;
    const { newRole } = req.body;
    const requesterAsWorkspaceMember = req.workspaceMember;

    if (requesterAsWorkspaceMember.id === workspaceMemberId) {
      throw boom.forbidden('You cannot update your own role in the project');
    }

    const updatedMember = await workspaceMemberService.updateRole(
      workspaceId,
      workspaceMemberId,
      newRole,
    );

    if (!updatedMember) {
      throw boom.badRequest(
        'update role to workspace member operation returns null',
      );
    }

    res.status(200).json({ message: 'Updated successfully', updatedMember });
  } catch (error) {
    next(error);
  }
};

const transferOwnership = async (req, res, next) => {
  try {
    const { workspaceMemberId } = req.params;
    const requesterAsWorkspaceMember = req.workspaceMember;

    await workspaceMemberService.transferOwnership(
      requesterAsWorkspaceMember,
      workspaceMemberId,
    );

    res.status(200).json({
      message: 'The workspace member was updated to owner in the workspace',
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { workspaceMemberId } = req.params;
    const requesterAsWorkspaceMember = req.workspaceMember;

    const deletedMember = await workspaceMemberService.removeMember(
      requesterAsWorkspaceMember,
      workspaceMemberId,
    );
    if (deletedMember === 0)
      throw boom.badRequest('Member not found or already removed');

    res.status(200).json({ message: 'Member was removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getworkspaceMembers,
  addMemberToWorkspace,
  changeRoleToMember,
  transferOwnership,
  removeMember,
};
