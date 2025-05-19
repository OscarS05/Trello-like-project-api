/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IWorkspaceMemberRepository {
  async create() {
    throw boom.notImplemented('the create() method is not implemented');
  }

  async update() {
    throw boom.notImplemented('the update() method is not implemented');
  }

  async delete() {
    throw boom.notImplemented('the delete() method is not implemented');
  }

  async findMemberByUserId() {
    throw boom.notImplemented(
      'the findMemberByUserId() method is not implemented',
    );
  }

  async findWorkspaceMemberById() {
    throw boom.notImplemented(
      'the findMemberByUserId() method is not implemented',
    );
  }

  async findAll() {
    throw boom.notImplemented('the findAll() method is not implemented');
  }
}

module.exports = IWorkspaceMemberRepository;
