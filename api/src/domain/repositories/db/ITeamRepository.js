/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ITeamRepository {
  async create() {
    throw boom.notImplemented(
      'the create(teamEntity) method is not implemented',
    );
  }

  async update() {
    throw boom.notImplemented(
      'the update(id, teamName) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the delete(teamId) method is not implemented');
  }

  async findById() {
    throw boom.notImplemented('the findById(teamId) method is not implemented');
  }

  async findAllByWorkspace() {
    throw boom.notImplemented(
      'the findAllByWorkspace(workspaceId) method is not implemented',
    );
  }

  async findAllByWorkspaceMember() {
    throw boom.notImplemented(
      'the findAllByWorkspaceMember(workspaceMemberId) method is not implemented',
    );
  }

  async countTeams() {
    throw boom.notImplemented(
      'the countTeams(workspaceMemberId) method is not implemented',
    );
  }
}

module.exports = ITeamRepository;
