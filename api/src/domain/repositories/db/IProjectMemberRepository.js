/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IProjectMemberRepository {
  async create() {
    throw boom.notImplemented('the create() method is not implemented');
  }

  async updateRole() {
    throw boom.notImplemented('the updateRole() method is not implemented');
  }

  async transferOwnership() {
    throw boom.notImplemented(
      'the transferOwnership() method is not implemented',
    );
  }

  async delete() {
    throw boom.notImplemented('the crdeleteeate() method is not implemented');
  }

  async findProjectMemberById() {
    throw boom.notImplemented(
      'the findProjectMemberById(projectMemberId, projectId) method is not implemented',
    );
  }

  async findByWorkspaceMember() {
    throw boom.notImplemented(
      'the findByWorkspaceMember() method is not implemented',
    );
  }

  async findByUser() {
    throw boom.notImplemented(
      'the findByUser(userId, workspaceId, projectId) method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented(
      'the findAll(workspaceMemberId) method is not implemented',
    );
  }

  async findAllByProject() {
    throw boom.notImplemented(
      'the findAll(projectId) method is not implemented',
    );
  }

  async findProjectWithItsMembersAndTeams() {
    throw boom.notImplemented(
      'the findProjectWithItsMembersAndTeams(projectId) method is not implemented',
    );
  }
}

module.exports = IProjectMemberRepository;
