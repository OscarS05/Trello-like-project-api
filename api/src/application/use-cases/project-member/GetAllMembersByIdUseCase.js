const boom = require('@hapi/boom');
const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetAllMembersByIdUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectMemberIds, projectId) {
    if (!Array.isArray(projectMemberIds) || projectMemberIds <= 0)
      throw boom.badRequest('There are no project member ids');
    const projectMembers = await this.projectMemberRepository.findAllById(
      projectMemberIds,
      projectId,
    );
    return projectMembers.map((member) => new ProjectMemberDto(member));
  }
}

module.exports = GetAllMembersByIdUseCase;
