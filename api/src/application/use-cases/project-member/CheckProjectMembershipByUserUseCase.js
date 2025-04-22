const ProjectMemberDto = require("../../dtos/projectMember.dto");

class CheckProjectMembershipByUserUseCase {
  constructor({ projectMemberRepository }){
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, projectId){
    const projectMember = await this.projectMemberRepository.checkProjectMemberByUser(userId, projectId);
    return projectMember?.id ? new ProjectMemberDto(projectMember) : {};
  }
}

module.exports = CheckProjectMembershipByUserUseCase;
