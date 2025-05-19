/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class ITeamMemberRepository {
  async create() {
    throw boom.notImplemented('the create() method is not implemented');
  }

  async updateRole() {
    throw boom.notImplemented(
      'the updateRole(teamMemberId, newRole) method is not implemented',
    );
  }

  async transferOwnership() {
    throw boom.notImplemented(
      'the transferOwnership(currentOwner, newOwner) method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented(
      'the delete(teamMemberId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(teamId, workspaceId) method is not implemented',
    );
  }

  async findOneByUserId() {
    throw boom.notImplemented(
      'the findOneByUserId(userId, workspaceId, teamId) method is not implemented',
    );
  }
}

module.exports = ITeamMemberRepository;
