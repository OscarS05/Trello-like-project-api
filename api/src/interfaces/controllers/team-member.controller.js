const { teamMemberService } = require('../../application/services/index');

const getTeamProjectsByTeamMember = async (req, res, next) => {
  try {
    const { teamId, teamMemberId } = req.params;

    const ProjectsTeamMemberBelongs =
      await teamMemberService.getTeamProjectsByTeamMember(teamId, teamMemberId);

    res.status(200).json({ ProjectsTeamMemberBelongs });
  } catch (error) {
    next(error);
  }
};

const getTeamMembers = async (req, res, next) => {
  try {
    const { workspaceId, teamId } = req.params;

    const teamMembers = await teamMemberService.getTeamMembers(
      teamId,
      workspaceId,
    );

    res.status(200).json({ teamMembers });
  } catch (error) {
    next(error);
  }
};

const addMemberToTeam = async (req, res, next) => {
  try {
    const { workspaceId, teamId } = req.params;
    const workspaceMemberToBeAdded = req.body;

    const addedMember = await teamMemberService.addMember(teamId, {
      workspaceId,
      teamId,
      ...workspaceMemberToBeAdded,
    });

    res
      .status(201)
      .json({ message: 'The team member was added successfully', addedMember });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { teamId, teamMemberId } = req.params;
    const { newRole } = req.body;

    const updatedMember = await teamMemberService.updateRole(
      teamId,
      teamMemberId,
      newRole,
    );

    res.status(201).json({
      message: 'The team member was added successfully',
      updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

const transferOwnership = async (req, res, next) => {
  try {
    const { teamMemberId } = req.params;
    const currentTeamMember = req.teamMember;

    const updatedMember = await teamMemberService.transferOwnership(
      currentTeamMember,
      teamMemberId,
    );

    res.status(201).json({
      message: 'The team member was updated successfully',
      updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const { workspaceId, teamId, teamMemberId } = req.params;
    const requesterAsTeamMember = req.teamMember;

    const removedRows = await teamMemberService.deleteTeamMember(
      teamId,
      workspaceId,
      requesterAsTeamMember,
      teamMemberId,
    );

    res
      .status(200)
      .json({ message: 'The member was successfully removed', removedRows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamProjectsByTeamMember,
  getTeamMembers,
  addMemberToTeam,
  updateRole,
  transferOwnership,
  deleteTeamMember,
};
