const Boom = require('@hapi/boom');

class CountProjectsUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceMemberId) {
    if (!workspaceMemberId) {
      throw Boom.badData('workspaceMemberId was not provided');
    }
    return this.projectRepository.countProjects(workspaceMemberId);
  }
}

module.exports = CountProjectsUseCase;
