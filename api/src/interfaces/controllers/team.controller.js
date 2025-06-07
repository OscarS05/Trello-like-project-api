const boom = require('@hapi/boom');

const { teamService } = require('../../application/services/index');

const getTeamsAndTheirMembersByWorkspace = async (req, res, next) => {
  try {
    const requesterAsWorkspaceMember = req.workspaceMember;

    const teams = await teamService.getTeamsByWorkspace(
      requesterAsWorkspaceMember,
    );

    res.status(200).json({ teams });
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { workspaceId } = req.params;
    const { workspaceMember } = req;

    const teamCreated = await teamService.createTeam({
      name,
      workspaceId,
      workspaceMemberId: workspaceMember.id,
    });
    if (!teamCreated?.id)
      throw boom.badRequest('The team create operation returns null');

    res
      .status(201)
      .json({ message: 'Team was successfully created', teamCreated });
  } catch (error) {
    next(error);
  }
};

const assignTeamToProject = async (req, res, next) => {
  try {
    const { workspaceId, teamId, projectId } = req.params;

    const result = await teamService.assignProject(
      workspaceId,
      teamId,
      projectId,
    );

    res
      .status(201)
      .json({ message: 'The team was successfully assigned', result });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { teamMember } = req;

    const updatedTeam = await teamService.updateTeam(teamMember.teamId, name);
    if (!updatedTeam?.id)
      throw boom.badImplementation('The update team operation returns null');

    res
      .status(200)
      .json({ message: 'Team was successfully updated', updatedTeam });
  } catch (error) {
    next(error);
  }
};

const unassignProject = async (req, res, next) => {
  try {
    const { workspaceId, teamId, projectId } = req.params;
    const { removeTeamMembersFromProject } = req.body;

    const result = await teamService.unassignProject(
      workspaceId,
      teamId,
      projectId,
      removeTeamMembersFromProject,
    );

    res
      .status(200)
      .json({ message: 'The team was successfully unassigned', result });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { workspaceId, teamId } = req.params;

    const result = await teamService.deleteTeam(workspaceId, teamId);

    res.status(200).json({ message: 'Team was successfully deleted', result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamsAndTheirMembersByWorkspace,
  createTeam,
  assignTeamToProject,
  updateProject,
  unassignProject,
  deleteProject,
};
